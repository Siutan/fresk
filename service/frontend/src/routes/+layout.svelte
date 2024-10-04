
<script lang="ts">
  import "../app.css";
  import { Toaster } from "$lib/components/ui/sonner";
  import { ModeWatcher } from "mode-watcher";
  import { currentUser } from "$lib/stores/user";
  import type { PageData } from "./$types";
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";

  import Nav from "$lib/components/nav.svelte";
  import { primaryRoutes, secondaryRoutes } from "$lib/components/layoutConfig";

  export let data: PageData;

  // Set the current user from the data passed in from the server
  $: currentUser.set(data.user);
</script>

<ModeWatcher />
<Toaster richColors={true} />

<div
  class="bg-background relative w-full min-h-screen flex justify-center"
  data-vaul-drawer-wrapper
>
  {#if !$currentUser}
    <slot />
  {:else}
    <div class="flex w-full h-screen p-2">
      <div class="flex flex-col justify-between gap-4">
        <Nav access_level={$currentUser.access_level} routes={primaryRoutes} />
        <Nav access_level={$currentUser.access_level} routes={secondaryRoutes} />
      </div>
      <div class="flex w-full justify-center">
        <ScrollArea
          class="w-full max-w-7xl h-full p-4 overflow-auto "
        >
          <slot />
        </ScrollArea>
      </div>
    </div>
  {/if}
</div>
