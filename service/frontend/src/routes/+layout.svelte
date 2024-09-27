<script lang="ts">
  import "../app.css";
  import { Toaster } from "$lib/components/ui/sonner";
  import { ModeWatcher } from "mode-watcher";
  import { currentUser } from "$lib/stores/user";
  import type { PageData } from "./$types";
  import { afterNavigate } from "$app/navigation";
  import { cubicOut } from "svelte/easing";
  import { fly, scale } from "svelte/transition";
  import { writable } from "svelte/store";
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
    <div class="flex w-full h-screen p-2 bg-background">
      <div class="flex flex-col">
        <Nav isCollapsed={true} routes={primaryRoutes} />
        <Nav isCollapsed={true} routes={secondaryRoutes} />
      </div>
      <div class="flex w-full justify-center">
        <div
          class="w-full max-w-7xl h-full p-5"
        >
          <slot />
        </div>
      </div>
    </div>
  {/if}
</div>
