<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Badge from "$lib/components/ui/badge/badge.svelte";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";

  import type { PageData } from "./$types";

  export let data: PageData;
  $: ({ app } = data);

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
</script>

<div class="flex flex-col w-full justify-between gap-4 p-4 overflow-auto">
  <div class="flex flex-col gap-4">
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
