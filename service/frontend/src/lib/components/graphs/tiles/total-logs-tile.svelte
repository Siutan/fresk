<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import { ArrowRightIcon } from "lucide-svelte";
  import Button from "../../ui/button/button.svelte";
  import { goto } from "$app/navigation";

  export let logsByDay: Record<string, number>;
  export let title: string;
  export let redirectTo: string;

  const getTotalLogs = (logsByDay: Record<string, number>) => {
    let totalLogs = 0;
    for (const day in logsByDay) {
      totalLogs += logsByDay[day];
    }
    return totalLogs;
  };

  const getLast24Hours = (logsByDay: Record<string, number>) => {
    let last24Hours = 0;
    const now = new Date();
    for (const day in logsByDay) {
      const logDate = new Date(day);
      const diffInHours =
        (now.getTime() - logDate.getTime()) / (1000 * 60 * 60);
      if (diffInHours < 24) {
        last24Hours += logsByDay[day];
      }
    }
    return last24Hours;
  };

  const getLogsForPeriod = (days: number) => {
    const filteredLogs: Record<string, number> = {};
    const now = new Date();
    for (const day in logsByDay) {
      const logDate = new Date(day);
      const diffInDays =
        (now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffInDays < days) {
        filteredLogs[day] = logsByDay[day];
      }
    }
    return filteredLogs;
  };
</script>

<Card.Root class="w-full bg-muted/40 border-muted">
  <Card.Header class="py-4">
    <div class="flex w-full items-center justify-between">
      <Card.Title>{title}</Card.Title>
      <Button variant="ghost"
      on:click={() => goto(redirectTo)}
        >See all
        <ArrowRightIcon />
      </Button>
    </div>
  </Card.Header>
  <Card.Content>
    <Tabs.Root>
      <Tabs.List class="grid w-full grid-cols-3">
        <Tabs.Trigger value="today">1d</Tabs.Trigger>
        <Tabs.Trigger value="week">7d</Tabs.Trigger>
        <Tabs.Trigger value="month">30d</Tabs.Trigger>
      </Tabs.List>
      <div class="pt-5">
        <Tabs.Content value="today">
            <div class="flex flex-col justify-between items-start gap-2">
              <div class="text-sm">Last 24 hours</div>
              <div class="text-2xl font-bold">{getLast24Hours(logsByDay)} logs</div>
            </div>
          </Tabs.Content>
          <Tabs.Content value="week">
            <div class="flex flex-col justify-between items-start gap-2">
              <div class="text-sm">Last 7 days</div>
              <div class="text-2xl font-bold">
                {getTotalLogs(getLogsForPeriod(7))} logs
              </div>
            </div>
          </Tabs.Content>
          <Tabs.Content value="month">
            <div class="flex flex-col justify-between items-start gap-2">
              <div class="text-sm">Last 30 days</div>
              <div class="text-2xl font-bold">
                {getTotalLogs(getLogsForPeriod(30))} logs
              </div>
            </div>
          </Tabs.Content>
      </div>
    </Tabs.Root>
  </Card.Content>
</Card.Root>
