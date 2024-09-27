<script lang="ts">
  import Search from "lucide-svelte/icons/search";
  import Input from "$lib/components/ui/input/input.svelte";
  import LogList from "$lib/components/logList.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { onMount } from "svelte";
  import { pbGet } from "$lib/queries/get";
  import type { RecordModel } from "pocketbase";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import { integrationStore } from "$lib/stores/integration";
  import Badge from "$lib/components/ui/badge/badge.svelte";

  let integrationsList: RecordModel[] = [];

  const fetchIntegrations = async () => {
    integrationsList = (await pbGet.getIntegrationsByApp()) ?? [];
  };

  onMount(() => {
    fetchIntegrations();
  });
</script>

<div class="flex items-center px-4 py-2">
  <h1 class="text-xl font-bold">integrations</h1>
</div>
<Separator />
<div
  class="bg-background/95 supports-[backdrop-filter]:bg-background/60 p-4 backdrop-blur space-y-4"
>
  <form>
    <div class="relative">
      <Search
        class="text-muted-foreground absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%]"
      />
      <Input placeholder="Search" class="pl-8" />
    </div>
  </form>
  <Separator />
  {#if integrationsList.length > 0}
    <ScrollArea class="h-screen">
      <div class="flex flex-col gap-2 ">
        {#each integrationsList as item}
          <button
            class="hover:bg-accent flex flex-col items-start gap-2 rounded-lg border border-secondary p-3 text-left text-sm transition-all {$integrationStore.selected ===
              item.id && 'bg-muted'}"
            on:click={() => integrationStore.setIntegration(item.id)}
          >
            <div class="flex w-full flex-col gap-1">
              <div class="flex items-center">
                <div class="flex items-center gap-2">
                  <div class="font-semibold">{item.service_name}</div>
                </div>
              </div>
              <div class="w-fit">
                <Badge variant={item.active ? "default" : "outline"}>
                  {item.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </button>
        {/each}
      </div>
    </ScrollArea>
  {:else}
    <div class="flex flex-col items-center justify-center gap-4 w-full p-5">
      <h2 class="text-2xl font-bold">No integrations found</h2>
    </div>
  {/if}
</div>
