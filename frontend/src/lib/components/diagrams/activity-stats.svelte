<script>
  import Icon from "$lib/components/custom/icon.svelte";
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
  <div class="flex flex-col gap-2 h-full w-full max-w-[200px]">
    
    <!-- Current Streak -->
    <Card.Root class="flex flex-col flex-1 justify-center py-[9px]">
      <Card.Content class="py-0 px-3 flex flex-col justify-center">
        <div class="flex items-center gap-1.5 text-[10px] font-medium leading-none text-muted-foreground">
          <Icon name="clock" class="h-3.5 w-3.5 text-muted-foreground" />
          Current streak
        </div>
        <div class="text-xs font-bold leading-none text-foreground mt-1 ml-5">
          {stats.currentStreak} day{stats.currentStreak !== 1 ? "s" : ""}
        </div>
      </Card.Content>
    </Card.Root>

    <!-- Longest Streak -->
    <Card.Root class="flex flex-col flex-1 justify-center py-[9px]">
      <Card.Content class="py-0 px-3 flex flex-col justify-center">
        <div class="flex items-center gap-1.5 text-[10px] font-medium leading-none text-muted-foreground">
          <Icon name="flame" class="h-3.5 w-3.5 text-muted-foreground" />
          Longest streak
        </div>
        <div class="flex items-baseline text-xs font-bold leading-none whitespace-nowrap text-foreground mt-1 ml-5">
          <span>
            {stats.longestStreak} day{stats.longestStreak !== 1 ? "s" : ""}
          </span>
          {#if stats.longestStreakDate}
            <div class="ml-1.5 text-xs font-normal leading-none text-muted-foreground">
              · {new Date(stats.longestStreakDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          {/if}
        </div>
      </Card.Content>
    </Card.Root>

    <!-- Most Active Day -->
    <Card.Root class="flex flex-col flex-1 justify-center py-[9px]">
      <Card.Content class="py-0 px-3 flex flex-col justify-center">
        <div class="flex items-center gap-1.5 text-[10px] font-medium leading-none text-muted-foreground">
          <Icon name="calendar" class="h-3.5 w-3.5 text-muted-foreground" />
          Most active day
        </div>
        <div class="text-xs font-bold leading-none text-foreground mt-1 ml-5">
          {stats.mostActiveDay}
        </div>
      </Card.Content>
    </Card.Root>

    <!-- Record Volume -->
    <Card.Root class="flex flex-col flex-1 justify-center py-[9px]">
      <Card.Content class="py-0 px-3 flex flex-col justify-center">
        <div class="flex items-center gap-1.5 text-[10px] font-medium leading-none text-muted-foreground">
          <Icon name="bar-chart" class="h-3.5 w-3.5 text-muted-foreground" />
          Record volume
        </div>
        <div class="flex items-baseline text-xs font-bold leading-none whitespace-nowrap text-foreground mt-1 ml-5">
          <span>
            {stats.mostActivityCount} activit{stats.mostActivityCount !== 1 ? "ies" : "y"}
          </span>
          {#if stats.mostActivityDate}
            <div class="ml-1.5 text-xs font-normal text-muted-foreground">
              · {new Date(stats.mostActivityDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          {/if}
        </div>
      </Card.Content>
    </Card.Root>

  </div>
{/if}
