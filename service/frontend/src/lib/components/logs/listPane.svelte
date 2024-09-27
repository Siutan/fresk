<script lang="ts">
  import Search from "lucide-svelte/icons/search";
  import * as Tabs from "$lib/components/ui/tabs";
  import Input from "$lib/components/ui/input/input.svelte";
  import LogList from "$lib/components/logList.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { onMount } from "svelte";
  import { pbGet } from "$lib/queries/get";
  import type { RecordModel } from "pocketbase";

  let logsList: RecordModel[] = [];

  onMount(() => {
    fetchLogs();
  });

  const fetchLogs = async () => {
    logsList = await pbGet.getAllLogs() ?? [];
  };
</script>

<Tabs.Root value="all">
  <div class="flex items-center px-4 py-2">
    <h1 class="text-xl font-bold">Error Logs</h1>
    <Tabs.List class="ml-auto">
      <Tabs.Trigger value="all" class="text-zinc-600 dark:text-zinc-200">
        All Logs
      </Tabs.Trigger>
      <Tabs.Trigger value="unread" class="text-zinc-600 dark:text-zinc-200">
        Unread
      </Tabs.Trigger>
    </Tabs.List>
  </div>
  <Separator />
  <div
    class="bg-background/95 supports-[backdrop-filter]:bg-background/60 p-4 backdrop-blur"
  >
    <form>
      <div class="relative">
        <Search
          class="text-muted-foreground absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%]"
        />
        <Input placeholder="Search" class="pl-8" />
      </div>
    </form>
  </div>
  <Tabs.Content value="all" class="m-0">
    {#if logsList.length > 0}
      <LogList items={logsList} />
    {:else}
      <div
        class="flex flex-col items-center justify-center gap-4 w-full max-w-lg"
      >
        <h2 class="text-2xl font-bold">No logs found</h2>
      </div>
    {/if}
  </Tabs.Content>
  <Tabs.Content value="unread" class="m-0">
    {#if logsList.length > 0}
      <LogList items={logsList} />
    {:else}
      <div
        class="flex flex-col items-center justify-center gap-4 w-full max-w-lg"
      >
        <h1 class="text-4xl font-bold">No logs found</h1>
      </div>
    {/if}
  </Tabs.Content>
</Tabs.Root>
