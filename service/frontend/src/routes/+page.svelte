<script lang="ts">
  import AppCard from "$lib/components/app-card.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  const { apps } = data;
</script>

<div class="flex h-screen overflow-hidden">
  <!-- Main Content -->
  <div class="flex-1 overflow-auto p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#if apps.length > 0}
        {#each apps as app}
          <AppCard appName={app.app_name} appId={app.id} status={app.active} />
        {/each}
      {:else}
        <div class="col-span-full flex flex-col items-center justify-center gap-4">
          <h2 class="text-2xl">No apps found</h2>
        </div>
      {/if}
    </div>
  </div>
</div>
