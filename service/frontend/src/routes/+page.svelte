<script lang="ts">
  import AppCard from "$lib/components/app-card.svelte";
  import { pbGet } from "$lib/queries/get";
  import type { PageData } from "./$types";

  export let data: PageData;

  const { apps } = data;
</script>

<div class="w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {#if apps.length > 0}
    {#each apps as app}
      <AppCard appName={app.app_name} appId={app.id} status={true} />
    {/each}
  {:else}
    <div class="flex flex-col items-center justify-center gap-4 w-full">
      <h2 class="text-2xl">No apps found</h2>
    </div>
  {/if}
</div>
