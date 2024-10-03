<script lang="ts">
  import { pbGet } from "$lib/queries/get";
  import { logStore } from "$lib/stores/logStore";
  import { flyAndScale } from "$lib/utils";
  import { fade } from "svelte/transition";
  import LogBlock from "./logBlock.svelte";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import LogHeader from "./logHeader.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import type { Log } from "$lib/types/Log";
  import {
    decodeStacktrace,
    enhancedDecodeStacktrace,
  } from "$lib/stacktraceHandler";

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

      const enhanced_trace = await enhancedDecodeStacktrace(
        thisLog.stacktrace,
        thisLog.build
      );

      console.log(enhanced_trace);
    } catch (error) {
      console.error("Error decoding stacktrace:", error);
      decoded_stacktrace = thisLog.stacktrace;
    }

    log = {
      id: thisLog.id,
      app_id: thisLog.app,
      build_id: thisLog.build,
      app_version: thisLog.app_version,
      app_environment: thisLog.app_environment,
      log_type: thisLog.log_type,
      value: thisLog.value,
      stacktrace: thisLog.stacktrace,
      decoded_stacktrace: decoded_stacktrace,
      browser_name: thisLog.browser_name,
      browser_version: thisLog.browser_version,
      os_name: thisLog.os_name,
      os_version: thisLog.os_version,
      device_type: thisLog.device_type,
      created: Number.parseInt(thisLog.created),
      custom: thisLog.custom,
      language: thisLog.language,
      memory_usage: thisLog.memory_usage,
      network_type: thisLog.network_type,
      page_id: thisLog.page_id,
      page_url: thisLog.page_url,
      performance_metrics: thisLog.performance_metrics,
      referrer: thisLog.referrer,
      screen_resolution: thisLog.screen_resolution,
      sdk_version: thisLog.sdk_version,
      session_email: thisLog.session_email,
      session_id: thisLog.session_id,
      time: thisLog.time,
      time_zone: thisLog.time_zone,
      updated: Number.parseInt(thisLog.updated),
      viewport_size: thisLog.viewport_size,
    };

    const removeKeys = [
      "id",
      "created",
      "app_id",
      "app_name",
      "app_version",
      "app_environment",
      "collectionId",
      "collectionName",
      "updated",
    ];

    logDisplay = Object.fromEntries(
      Object.entries(log).filter(([key]) => !removeKeys.includes(key))
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
          {#each Object.entries(logDisplay) as [key, value]}
            <div class="flex items-center justify-between w-full">
              <LogBlock blockName={key} blockValue={value} />
            </div>
          {/each}
        {/if}
      </ScrollArea>
    </div>
  {/if}
</div>
