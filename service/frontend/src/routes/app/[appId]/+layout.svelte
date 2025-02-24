<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { HomeIcon, ChevronRight, ChevronDown } from "lucide-svelte";

  import type { PageData } from "./$types";

  export let data: PageData;
  $: ({ app, apps } = data);

  const appId = $page.params.appId;

  const tabs = [
    { value: "overview", label: "Overview", path: "" },
    { value: "groups", label: "Groups", path: "groups" },
    { value: "logs", label: "Logs", path: "logs" },
    { value: "settings", label: "Settings", path: "settings" },
  ];

  $: currentTab = getCurrentTab($page.url.pathname);

  function getCurrentTab(pathname: string): string {
    const path = pathname.split("/").pop() || "";
    const tab = tabs.find((tab) => tab.path === path);
    return tab ? tab.value : "overview";
  }

  const handleTabChange = (value: string | undefined) => {
    if (!value) return;
    const tab = tabs.find((tab) => tab.value === value);
    if (tab) {
      goto(`/app/${appId}/${tab.path}`);
    }
  };

  const handleAppChange = (newAppId: string) => {
    const currentPath = getCurrentTab($page.url.pathname);
    goto(`/app/${newAppId}/${currentPath}`);
  };
</script>

<div class="flex flex-col w-full justify-between gap-4 p-4 overflow-auto">
  <div class="flex flex-col gap-4">
    <nav class="flex items-center space-x-2 text-sm text-muted-foreground">
      <a href="/" class="flex items-center hover:text-foreground">
        <HomeIcon class="h-4 w-4" />
      </a>
      <ChevronRight class="h-4 w-4" />
      <Popover.Root>
        <Popover.Trigger class="flex items-center gap-1 hover:text-foreground">
          {app.app_name}
          <ChevronDown class="h-4 w-4" />
        </Popover.Trigger>
        <Popover.Content class="w-64 p-2">
          <div class="flex flex-col space-y-1">
            {#each apps as otherApp}
              <button
                class="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors {otherApp.id === appId ? 'bg-accent' : ''}"
                on:click={() => handleAppChange(otherApp.id)}
              >
                <span class="flex-1">{otherApp.app_name}</span>
                <span class={`w-2 h-2 rounded-full ${otherApp.active ? 'bg-green-500' : 'bg-red-500'}`} />
              </button>
            {/each}
          </div>
        </Popover.Content>
      </Popover.Root>
      {#if $page.url.pathname !== `/app/${appId}`}
        <ChevronRight class="h-4 w-4" />
        <span>{tabs.find(tab => tab.path === getCurrentTab($page.url.pathname))?.label || ''}</span>
      {/if}
    </nav>
    <Tabs.Root value={currentTab} onValueChange={handleTabChange}>
      <Tabs.List class="grid w-full grid-cols-4">
        {#each tabs as tab}
          <Tabs.Trigger value={tab.value}>{tab.label}</Tabs.Trigger>
        {/each}
      </Tabs.List>
    </Tabs.Root>
    <Card.Root
      class="w-full bg-muted/40 border-muted flex gap-4 justify-between"
    >
      <Card.Header>
        <div class="text-xl font-bold">{app.app_name}</div>
        <div class="text-sm">App ID: {app.id}</div>
      </Card.Header>
      <Card.Content>
        <div class="w-full h-full flex flex-col gap-4 items-end justify-center">
          <a
            href={app.link}
            target="_blank"
            class="text-sky-600 hover:underline text-sm">{app.link ? app.link : "No link"}</a
          >
          <Badge variant={app.active ? "default" : "destructive"}>
            {app.active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </Card.Content>
    </Card.Root>
  </div>
  <slot />
</div>
