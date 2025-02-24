<script lang="ts">
  import PagesTile from "$lib/components/graphs/tiles/pages-tile.svelte";
  import TotalLogsTile from "$lib/components/graphs/tiles/total-logs-tile.svelte";
  import TotalLogs from "$lib/components/graphs/total-logs.svelte";
  import * as Card from "$lib/components/ui/card/index.js";

  export let data;
</script>

<div class="w-full flex flex-col gap-4">
  <!-- Dashboard Header -->
  <Card.Root class="w-full bg-muted/40 border-muted">
    <Card.Header>
      <h2 class="text-2xl font-bold">Dashboard Overview</h2>
      <p class="text-sm text-muted-foreground">Monitor your application's performance and error metrics</p>
    </Card.Header>
  </Card.Root>

  <!-- Metrics Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <TotalLogsTile
      title="Total Logs"
      redirectTo="/app/{data.app.id}/logs"
      logsByDay={data.logsByDay}
    />
    <PagesTile
      logsByPage={data.logsByPage}
    />
    <Card.Root class="bg-muted/40 border-muted p-4">
      <Card.Header>
        <h3 class="text-lg font-semibold">Active Users</h3>
      </Card.Header>
      <Card.Content>
        <div class="h-[200px] flex items-center justify-center">
          <p class="text-muted-foreground">Coming Soon</p>
        </div>
      </Card.Content>
    </Card.Root>
  </div>

  <!-- Detailed Charts -->
  <div class="grid grid-cols-1 gap-4">
    <Card.Root class="w-full bg-muted/40 border-muted">
      <Card.Header>
        <h3 class="text-lg font-semibold">Error Trends</h3>
      </Card.Header>
      <Card.Content>
        <TotalLogs data={data.logsByDay} />
      </Card.Content>
    </Card.Root>
  </div>
</div>
