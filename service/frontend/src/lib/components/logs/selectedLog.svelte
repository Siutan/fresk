<script lang="ts">
  import { pbGet } from "$lib/queries/get";
  import { logStore } from "$lib/stores/logStore";
  import { flyAndScale } from "$lib/utils";
  import { fade } from "svelte/transition";
  import LogBlock from "./logBlock.svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import LogHeader from "./logHeader.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import * as Tabs from "$lib/components/ui/tabs";
  import { decodeStacktrace } from "$lib/stacktraceHandler";

  import type { Log } from "$lib/types/Log";

  let log: Log | undefined;

  let logDisplay: Partial<Log> | undefined;
  let appDetails: any;

  const fetchLog = async (id: string) => {
    const { data: thisLog, error } = await pbGet.getLogById(id);
    if (error || !thisLog) return;

    const { data: app, error: appError } = await pbGet.getAppById(
      undefined,
      thisLog.app
    );
    if (appError || !app) return;
    appDetails = app;

    let decoded_stacktrace;
    try {
      decoded_stacktrace = await decodeStacktrace(
        thisLog.stacktrace,
        thisLog.build
      );
    } catch (error) {
      console.error("Error decoding stacktrace:", error);
      decoded_stacktrace = thisLog.stacktrace;
    }

    log = {
      ...thisLog,
      decoded_stacktrace,
    } as Log;

    // Filter out unwanted keys for display
    logDisplay = Object.fromEntries(
      Object.entries(log).filter(
        ([key]) =>
          ![
            "id",
            "created",
            "app_id",
            "app_name",
            "app_version",
            "app_environment",
            "collectionId",
            "collectionName",
            "updated",
          ].includes(key)
      )
    );
  };

  logStore.subscribe(async (log) => {
    if (!log.selected) return;
    await fetchLog(log.selected);
  });
</script>

<div
  class="flex flex-col items-center justify-center gap-4 w-full"
  in:flyAndScale={{ y: 20, x: 0, start: 0.95, duration: 150 }}
  out:fade={{ duration: 150 }}
>
  {#if !log}
    <div class="w-full h-screen flex items-center justify-center">
      <h2 class="text-2xl">No log selected</h2>
    </div>
  {:else}
    <div class="w-full flex flex-col gap-4">
      <LogHeader
        id={log.id}
        appId={log.app_id}
        appName={appDetails?.app_name || "unknown"}
        appVersion={log.app_version}
        appEnvironment={log.app_environment}
        logType={log.log_type}
        time={log.time}
      />
      <Separator />
      <ScrollArea class="h-[80dvh] px-5">
        {#if logDisplay}
          <Tabs.Root value="structured">
            <Tabs.List class="grid w-full grid-cols-2">
              <Tabs.Trigger value="structured">structured</Tabs.Trigger>
              <Tabs.Trigger value="json">json</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="structured">
              {#each Object.entries(logDisplay) as [key, value]}
                <div class="flex items-center justify-between w-full">
                  <LogBlock blockName={key} blockValue={value} />
                </div>
              {/each}
            </Tabs.Content>
            <Tabs.Content value="json">
              <pre class="whitespace-pre-wrap break-all">{JSON.stringify(
                  logDisplay,
                  null,
                  2
                )}</pre>
            </Tabs.Content>
          </Tabs.Root>
        {/if}
      </ScrollArea>
    </div>
  {/if}
</div>
