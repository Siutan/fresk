<script lang="ts">
  import type { Log } from "$lib/types/Log";

  export let currentError: Log;
</script>

{#if currentError.custom}
  <div class="flex flex-col gap-4 w-full">
    <h3 class="text-sm font-bold">Custom</h3>
    <div class="flex flex-col gap-2 w-full">
      {#each Object.entries(currentError.custom) as [key, value]}
        <div class="flex flex-col gap-2 w-full px-4 py-2 rounded-md bg-muted">
          <h3 class="text-sm font-bold">
            {key}
          </h3>
          <p class="text-sm capitalize text-muted-foreground">
            {value}
          </p>
        </div>
      {/each}
    </div>
  </div>
{/if}
