<script lang="ts">
  import type { Log } from "$lib/types/Log";

  export let currentError: Log;
</script>

<div class="flex flex-col gap-4 w-full">
  <h3 class="text-sm font-bold">Breadcrumbs</h3>
  <div class="flex flex-col gap-2 w-full">
    {#if currentError.breadcrumbs.length > 0}
      {#if currentError.breadcrumbs.length > 3}
        <details>
          <summary class="cursor-pointer">Show Breadcrumbs</summary>
          <div class="flex flex-col gap-2">
            {#each currentError.breadcrumbs as breadcrumb}
              <div
                class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
              >
                <h3 class="text-sm font-bold">
                  {breadcrumb.category}
                </h3>
                <p
                  class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
                >
                  {breadcrumb.message}
                </p>
              </div>
            {/each}
          </div>
        </details>
      {:else}
        <div class="flex flex-col gap-2">
          {#each currentError.breadcrumbs as breadcrumb}
            <div
              class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
            >
              <h3 class="text-sm font-bold">
                {breadcrumb.category}
              </h3>
              <p
                class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
              >
                {breadcrumb.message}
              </p>
            </div>
          {/each}
        </div>
      {/if}
    {:else}
      <div class="flex flex-col gap-2">
        <div
          class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
        >
          <h3 class="text-sm font-bold">Breadcrumbs</h3>
          <p
            class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
          >
            No breadcrumbs found
          </p>
        </div>
      </div>
    {/if}
  </div>
</div>
