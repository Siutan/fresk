<script lang="ts">
  import { logStore } from "$lib/stores/logStore";
  import type { Log } from "$lib/types/Log";
  import { formatTimeAgo } from "$lib/utils";
  import type { RecordModel } from "pocketbase";
  import { ScrollArea } from "./ui/scroll-area";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";

  export let items: RecordModel[];

  const handleSelectLog = (id: string) => {
    // $page.url.searchParams.set("log", id);
    // // set the url to the new log
    // if (browser) {
    //   window.history.pushState(
    //     {},
    //     "",
    //     `${$page.url.pathname}?page=${$page.url.searchParams.get("page")}&log=${$page.url.searchParams.get("log")}`
    //   );
    // }
    logStore.setLog(id);
  };
</script>

<ScrollArea class="h-screen">
  <div class="flex flex-col gap-2 p-4 pt-0 pb-44">
    {#each items as item}
      <button
        class="hover:bg-accent flex flex-col items-start gap-2 rounded-lg border border-secondary p-3 text-left text-sm transition-all {$logStore.selected ===
          item.id && 'bg-muted'}"
        on:click={() => handleSelectLog(item.id)}
      >
        <div class="flex w-full flex-col gap-1">
          <div class="flex items-center">
            <div class="flex items-center gap-2">
              <div class="font-semibold">{item.kind}</div>
            </div>
            <div
              class="ml-auto text-xs {$logStore.selected === item.id
                ? 'text-foreground'
                : 'text-muted-foreground'}"
            >
              {formatTimeAgo(new Date(item.created))}
            </div>
          </div>
          <div class="text-xs font-medium">{item.app_environment}</div>
        </div>
        <div class="text-muted-foreground line-clamp-2 text-xs">
          {item.value.substring(0, 300)}
        </div>
      </button>
    {/each}
    <p class="text-center text-sm text-muted-foreground py-5">End of logs</p>
  </div>
</ScrollArea>
