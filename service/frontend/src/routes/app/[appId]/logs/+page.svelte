<script lang="ts">
  import LogTable from "$lib/components/log-table.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  const { app } = data;
</script>

<div class="w-full flex flex-col gap-4">
  <!-- log list -->
  <div class="">
      <LogTable appId={app.id} />
  </div>
</div>
