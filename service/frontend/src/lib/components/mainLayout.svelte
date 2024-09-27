<script lang="ts">
  import * as Resizable from "./ui/resizable";
  import Separator from "./ui/separator/separator.svelte";

  import Nav from "./nav.svelte";
  import { primaryRoutes, secondaryRoutes } from "./layoutConfig";
  import LogoutBtn from "./logoutBtn.svelte";
  import ThemeSwitcher from "./themeSwitcher.svelte";
  import { page } from "$app/stores";
  import SelectedLog from "$lib/components/logs/selectedLog.svelte";
  import ListPane from "$lib/components/logs//listPane.svelte";
  import ListIntegrations from "./pages/integrations/ListIntegrations.svelte";
  import { fade } from "svelte/transition";
  import SelectedIntegration from "./pages/integrations/selectedIntegration.svelte";

  // biome-ignore lint/style/useConst: <explanation>
  export let defaultLayout = [265, 440, 655];
  // biome-ignore lint/style/useConst: <explanation>
  export let defaultCollapsed = false;
  export let navCollapsedSize: number;

  $: isCollapsed = defaultCollapsed;

  function onLayoutChange(sizes: number[]) {
    document.cookie = `PaneForge:layout=${JSON.stringify(sizes)}`;
  }

  function onCollapse() {
    isCollapsed = true;
    document.cookie = `PaneForge:collapsed=${true}`;
  }

  function onExpand() {
    isCollapsed = false;
    document.cookie = `PaneForge:collapsed=${false}`;
  }
</script>

<div class="hidden md:block w-full h-screen">
  <Resizable.PaneGroup
    direction="horizontal"
    {onLayoutChange}
    class="h-full items-stretch"
  >
    <Resizable.Pane
      defaultSize={defaultLayout[0] || 265}
      collapsedSize={navCollapsedSize}
      collapsible
      minSize={15}
      maxSize={20}
      {onCollapse}
      {onExpand}
    >
      <div class="flex flex-col w-full items-center gap-2 p-2 pb-3">
        <ThemeSwitcher {isCollapsed} />
      </div>
      <Separator />
      <Nav {isCollapsed} routes={primaryRoutes} />
      <Separator />
      <Nav {isCollapsed} routes={secondaryRoutes} />
      <Separator />
      <div class="flex flex-col w-full items-center gap-2 p-2">
        <LogoutBtn {isCollapsed} />
      </div>
    </Resizable.Pane>
    <Resizable.Handle withHandle />
    <Resizable.Pane defaultSize={defaultLayout[1]} minSize={30}>
      {#if $page.url.pathname === "/"}
        <div transition:fade={{ duration: 300 }}>
          <ListPane />
        </div>
      {:else if $page.url.pathname === "/integrations"}
        <div in:fade={{ duration: 300 }}>
          <ListIntegrations />
        </div>
      {/if}
    </Resizable.Pane>
    <Resizable.Handle withHandle />
    <Resizable.Pane defaultSize={defaultLayout[2]} minSize={30}>
      {#if $page.url.pathname === "/"}
        <div transition:fade={{ duration: 300 }}>
          <SelectedLog />
        </div>
      {:else if $page.url.pathname === "/integrations"}
        <div in:fade={{ duration: 300 }}>
          <SelectedIntegration />
        </div>
      {/if}
    </Resizable.Pane>
  </Resizable.PaneGroup>
</div>
