<script lang="ts">
  import PagesTile from "$lib/components/graphs/tiles/pages-tile.svelte";
  import TotalLogsTile from "$lib/components/graphs/tiles/total-logs-tile.svelte";
  import TotalLogs from "$lib/components/graphs/total-logs.svelte";

  export let data;

</script>

<div class="w-full flex flex-col gap-4">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <TotalLogsTile
      title="Total Logs"
      redirectTo="/app/{data.app.id}/logs"
      logsByDay={data.logsByDay}
    />
    <PagesTile
      logsByPage={data.logsByPage}
    />
  </div>
  <TotalLogs data={data.logsByDay} />
</div>
