<script lang="ts">
  import LogGroupTable from "$lib/components/log-group-table/log-group-table.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  const { app } = data;
</script>

<div class="w-full flex flex-col gap-4">
  <!-- log list -->
  <div class="">
    <LogGroupTable appId={app.id} />
  </div>
</div>
