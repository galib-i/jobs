import sqlite3
import random
import datetime

companies = [
    "Google", "Amazon", "Microsoft", "Apple", "Meta", "Netflix", "Tesla", "Twitter", "Uber", "Airbnb",
    "Spotify", "Stripe", "Square", "Palantir", "Snap", "Pinterest", "Lyft", "Zoom", "Slack", "Dropbox",
    "GitHub", "GitLab", "Atlassian", "Twilio", "Datadog", "Snowflake", "Okta", "Cloudflare", "MongoDB",
    "Elastic", "Splunk", "New Relic", "AppDynamics", "Dynatrace", "Cisco", "IBM", "Oracle", "SAP",
    "Salesforce", "Adobe", "Intuit", "Autodesk", "Workday", "ServiceNow", "Veeva", "Shopify", "Etsy",
    "Wayfair", "Zillow", "Redfin", "Coinbase", "Robinhood", "Kraken", "Gemini", "Binance", "Plaid",
    "Brex", "Ramp", "Gusto", "Rippling", "Deel", "Remote", "Oyster", "Figma", "Canva", "Miro", "Notion",
    "Airtable", "Coda", "Roam", "Obsidian", "Linear", "Asana", "Monday", "ClickUp", "Trello", "Jira"
]

roles = [
    "Software Engineer", "Senior Software Engineer", "Staff Software Engineer", "Principal Software Engineer",
    "Frontend Engineer", "Backend Engineer", "Fullstack Engineer", "Mobile Engineer", "iOS Engineer",
    "Android Engineer", "Data Engineer", "Data Scientist", "Machine Learning Engineer", "DevOps Engineer",
    "Site Reliability Engineer", "Security Engineer", "Cloud Engineer", "Infrastructure Engineer",
    "Systems Engineer", "QA Engineer", "Test Engineer", "Release Engineer", "Product Manager",
    "Engineering Manager", "Director of Engineering", "VP of Engineering", "CTO"
]

locations = [
    "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "London, UK", "Berlin, Germany",
    "Toronto, Canada", "Remote", "Remote (US)", "Remote (Europe)", "Remote (Global)", "Chicago, IL",
    "Boston, MA", "Los Angeles, CA", "San Diego, CA", "Denver, CO", "Boulder, CO", "Portland, OR",
    "Vancouver, Canada", "Dublin, Ireland", "Amsterdam, Netherlands", "Paris, France", "Sydney, Australia",
    "Singapore", "Tokyo, Japan", "Bangalore, India", "Tel Aviv, Israel", "Dubai, UAE"
]

stages_pool = [
    "Application", "Recruiter Screen", "Technical Screen", "Take-home Assignment", "Onsite Interview",
    "Manager Interview", "Offer Extended", "Offer Accepted", "Offer Declined", "Rejected", "Withdrawn"
]

descriptions = [
    "Exciting opportunity to work on highly scalable systems.",
    "Looking for a strong engineer to join our core team.",
    "Help us build the next generation of our product.",
    "Join a fast-paced startup and make a big impact.",
    "We are looking for someone with experience in modern web technologies.",
    "Great benefits and a flexible work environment.",
    "Work with cutting-edge technologies like Go, React, and Kubernetes.",
    "Looking for a leader to guide our engineering efforts.",
    "Join our data team and help us make sense of our massive datasets.",
    "Help us secure our infrastructure and protect our users' data."
]

notes = [
    "Applied through a referral.",
    "Found on LinkedIn.",
    "Reached out to the recruiter directly.",
    "Need to follow up next week.",
    "Seems like a great fit.",
    "Not sure about the salary range.",
    "Waiting for feedback from the technical screen.",
    "They use a tech stack I'm very familiar with.",
    "The team seems very friendly.",
    "Not my first choice, but a good backup option."
]

def generate_random_date(start_date, end_date):
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    random_date = start_date + datetime.timedelta(days=random_number_of_days)
    return random_date

def seed_database():
    conn = sqlite3.connect('jobs.db')
    cursor = conn.cursor()

    # Create tables if they don't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        location TEXT NOT NULL,
        link TEXT,
        description TEXT,
        notes TEXT
    );
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS stages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER,
        stage TEXT NOT NULL,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
    );
    ''')

    # Generate ~100 random jobs
    num_jobs = random.randint(90, 110)
    
    start_date = datetime.date(2023, 1, 1)
    end_date = datetime.date.today()

    for _ in range(num_jobs):
        company = random.choice(companies)
        role = random.choice(roles)
        location = random.choice(locations)
        link = f"https://{company.lower().replace(' ', '')}.com/careers/job"
        description = random.choice(descriptions) if random.random() > 0.3 else ""
        note = random.choice(notes) if random.random() > 0.5 else ""

        # Insert job
        cursor.execute('''
            INSERT INTO jobs (company, role, location, link, description, notes)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (company, role, location, link, description, note))
        
        job_id = cursor.lastrowid
        
        # Generate stages for the job
        num_stages = random.randint(1, 5)
        
        # Always start with Application
        job_stages = ["Application"]
        
        current_date = generate_random_date(start_date, end_date)
        cursor.execute('''
            INSERT INTO stages (job_id, stage, last_updated)
            VALUES (?, ?, ?)
        ''', (job_id, "Application", current_date.strftime("%Y-%m-%d %H:%M:%S")))
        
        if num_stages > 1:
            possible_next_stages = [s for s in stages_pool if s != "Application"]
            selected_next_stages = random.sample(possible_next_stages, num_stages - 1)
            
            # Sort them roughly in chronological order based on typical process
            selected_next_stages.sort(key=lambda x: stages_pool.index(x))
            
            for stage in selected_next_stages:
                # advance date by 1 to 14 days
                current_date += datetime.timedelta(days=random.randint(1, 14))
                # ensure we don't go into the future
                if current_date > datetime.date.today():
                    current_date = datetime.date.today()
                    
                cursor.execute('''
                    INSERT INTO stages (job_id, stage, last_updated)
                    VALUES (?, ?, ?)
                ''', (job_id, stage, current_date.strftime("%Y-%m-%d %H:%M:%S")))

    conn.commit()
    conn.close()
    
    print(f"Successfully seeded database with {num_jobs} jobs and their stages.")

if __name__ == "__main__":
    seed_database()
