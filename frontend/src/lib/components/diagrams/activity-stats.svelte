<script>
  import ClockIcon from "@tabler/icons-svelte/icons/clock";
  import FlameIcon from "@tabler/icons-svelte/icons/flame";
  import CalendarIcon from "@tabler/icons-svelte/icons/calendar";
  import ChartBarIcon from "@tabler/icons-svelte/icons/chart-bar";
  import * as Card from "$lib/components/ui/card/index.js";
  import { GetActivityStats } from "../../../../bindings/jobs/jobservice";

  let stats = $state(null);

  async function load() {
    try {
      stats = await GetActivityStats();
    } catch (err) {
      console.error(err);
    }
  }

  load();
</script>

{#if stats}
  <div class="flex h-full w-full max-w-50 flex-col gap-2">
    <!-- Current Streak -->
    <Card.Root class="flex flex-1 flex-col justify-center py-2.25">
      <Card.Content class="flex flex-col justify-center px-3 py-0">
        <div
          class="text-muted-foreground flex items-center gap-1.5 text-[10px] leading-none font-medium"
        >
          <ClockIcon class="text-muted-foreground h-3.5 w-3.5" />
          Current streak
        </div>
        <div class="text-foreground mt-1 ml-5 text-xs leading-none font-bold">
          {stats.currentStreak} day{stats.currentStreak !== 1 ? "s" : ""}
        </div>
      </Card.Content>
    </Card.Root>

    <!-- Longest Streak -->
    <Card.Root class="flex flex-1 flex-col justify-center py-2.25">
      <Card.Content class="flex flex-col justify-center px-3 py-0">
        <div
          class="text-muted-foreground flex items-center gap-1.5 text-[10px] leading-none font-medium"
        >
          <FlameIcon class="text-muted-foreground h-3.5 w-3.5" />
          Longest streak
        </div>
        <div
          class="text-foreground mt-1 ml-5 flex items-baseline text-xs leading-none font-bold whitespace-nowrap"
        >
          <span>
            {stats.longestStreak} day{stats.longestStreak !== 1 ? "s" : ""}
          </span>
          {#if stats.longestStreakDate}
            <div class="text-muted-foreground ml-1.5 text-xs leading-none font-normal">
              · {new Date(stats.longestStreakDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          {/if}
        </div>
      </Card.Content>
    </Card.Root>

    <!-- Most Active Day -->
    <Card.Root class="flex flex-1 flex-col justify-center py-2.25">
      <Card.Content class="flex flex-col justify-center px-3 py-0">
        <div
          class="text-muted-foreground flex items-center gap-1.5 text-[10px] leading-none font-medium"
        >
          <CalendarIcon class="text-muted-foreground h-3.5 w-3.5" />
          Most active day
        </div>
        <div class="text-foreground mt-1 ml-5 text-xs leading-none font-bold">
          {stats.mostActiveDay || "-"}
        </div>
      </Card.Content>
    </Card.Root>

    <!-- Record Volume -->
    <Card.Root class="flex flex-1 flex-col justify-center py-2.25">
      <Card.Content class="flex flex-col justify-center px-3 py-0">
        <div
          class="text-muted-foreground flex items-center gap-1.5 text-[10px] leading-none font-medium"
        >
          <ChartBarIcon class="text-muted-foreground h-3.5 w-3.5" />
          Most activity
        </div>
        <div
          class="text-foreground mt-1 ml-5 flex items-baseline text-xs leading-none font-bold whitespace-nowrap"
        >
          <span>
            {stats.mostActivityCount}
          </span>
          {#if stats.mostActivityDate}
            <div class="text-muted-foreground ml-1.5 text-xs font-normal">
              · {new Date(stats.mostActivityDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </div>
          {/if}
        </div>
      </Card.Content>
    </Card.Root>
  </div>
{/if}
