<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Tab from "$lib/components/ui/tabs/index.js";
  import {
    ChevronFirst,
    ChevronLast,
    ChevronLeft,
    ChevronRight,
    SquareArrowOutUpRight,
  } from "lucide-svelte";
  import type { PageData } from "./$types";
  import { Button } from "$lib/components/ui/button";
  import { enhancedDecodeStacktrace } from "$lib/stacktraceHandler";
  import CodeContextViewer from "$lib/components/code-context-viewer.svelte";
  import Loader from "$lib/components/loader.svelte";
  import LogGroupInfoCard from "$lib/components/group/log-group-info-card.svelte";
  import LogGroupHeaderCard from "$lib/components/group/log-group-header-card.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { goto } from "$app/navigation";
  import { getBrowserIcon } from "$lib/helpers/browser-icon-parser";
  import { getOSIcon } from "$lib/helpers/os-icon-parser";

  export let data: PageData;

  const { group, pageBreakdown, browserBreakdown, osBreakdown, errors } = data;

  console.log(data);

  let currentLogIndex = errors ? errors.length - 1 : 0;

  const cycleLogs = (direction: "previous" | "next" | "first" | "last") => {
    if (!errors) return;

    switch (direction) {
      case "previous":
        if (currentLogIndex > 0) {
          currentLogIndex--;
        }
        break;
      case "next":
        // Do nothing if at the end
        if (currentLogIndex < errors.length - 1) {
          currentLogIndex++;
        }
        break;
      case "first":
        // Do nothing if already at the first log
        if (currentLogIndex > 0) {
          currentLogIndex = 0;
        }
        break;
      case "last":
        currentLogIndex = errors.length - 1;
        break;
    }
  };

  const getStacktrace = async (id: string) => {
    if (!errors) return;
    const trace = await enhancedDecodeStacktrace(
      errors[currentLogIndex].stacktrace,
      errors[currentLogIndex].build
    );

    return trace;
  };
</script>

<div class="w-full flex flex-col gap-4 pb-20">
  {#if group}
    <div class="flex flex-col gap-4">
      <LogGroupHeaderCard
        {group}
        error={errors && errors.length > 0 ? errors[0] : null}
      />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="flex flex-col gap-4 sticky top-0">
        <LogGroupInfoCard
          {group}
          {pageBreakdown}
          {browserBreakdown}
          {osBreakdown}
        />
      </div>
      <div class="md:col-span-3 flex flex-col gap-4">
        <Card.Root class="w-fuit bg-muted/40 border-muted gap-4">
          <Card.Header>
            <h2 class="text-xl font-bold">Events</h2>
          </Card.Header>
          <Card.Content>
            <div class="flex flex-col gap-4">
              <Tab.Root>
                <Tab.List>
                  <Tab.Trigger value="overview">Details</Tab.Trigger>
                  <Tab.Trigger value="events">Discussion</Tab.Trigger>
                  <Tab.Trigger value="metrics">metrics</Tab.Trigger>
                  <Tab.Trigger value="logs">Logs</Tab.Trigger>
                </Tab.List>
                <div class="w-full">
                  <Tab.Content value="overview">
                    <div class="flex flex-col gap-2 w-full">
                      {#if !errors}
                        <div class="text-sm">No errors found</div>
                      {:else}
                        {@const currentError = errors[currentLogIndex]}
                        <div class="flex flex-col gap-4">
                          <h3 class="text-sm font-bold">Details</h3>
                          <!-- Header -->
                          <div class="flex items-center justify-between gap-4">
                            <h2 class="text-xl font-bold">
                              Log Id: {currentError.id}
                            </h2>

                            <div class="flex gap-2">
                              <Button
                                size="icon"
                                on:click={() => cycleLogs("first")}
                                disabled={currentLogIndex === 0}
                              >
                                <ChevronFirst />
                              </Button>
                              <Button
                                size="icon"
                                on:click={() => cycleLogs("previous")}
                                disabled={currentLogIndex === 0}
                              >
                                <ChevronLeft />
                              </Button>
                              <Button
                                size="icon"
                                on:click={() => cycleLogs("next")}
                                disabled={currentLogIndex === errors.length - 1}
                              >
                                <ChevronRight />
                              </Button>
                              <Button
                                size="icon"
                                on:click={() => cycleLogs("last")}
                                disabled={currentLogIndex === errors.length - 1}
                              >
                                <ChevronLast />
                              </Button>
                            </div>
                          </div>
                          <!-- Tag Pills -->
                          <div class="flex flex-wrap gap-4 w-full">
                            <div
                              class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
                            >
                              <h3 class="text-sm font-bold">Device</h3>
                              <p
                                class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
                              >
                                {currentError.device_type}
                              </p>
                            </div>
                            <div
                              class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
                            >
                              <h3 class="text-sm font-bold">
                                Operating System
                              </h3>
                              <p
                                class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
                              >
                                {currentError.os_name}
                              </p>
                            </div>
                            <div
                              class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
                            >
                              <h3 class="text-sm font-bold">Browser</h3>
                              <p
                                class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
                              >
                                {currentError.browser_name}
                                {currentError.browser_version}
                              </p>
                            </div>
                            <div
                              class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
                            >
                              <h3 class="text-sm font-bold">Network Type</h3>
                              <p
                                class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
                              >
                                {currentError.network_type}
                              </p>
                            </div>
                            <div
                              class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
                            >
                              <h3 class="text-sm font-bold">Viewport Size</h3>
                              <p
                                class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
                              >
                                {currentError.viewport_size}
                              </p>
                            </div>
                            <div
                              class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
                            >
                              <h3 class="text-sm font-bold">
                                Screen Resolution
                              </h3>
                              <p
                                class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
                              >
                                {currentError.screen_resolution}
                              </p>
                            </div>
                            <div
                              class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
                            >
                              <h3 class="text-sm font-bold">Language</h3>
                              <p
                                class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
                              >
                                {currentError.language}
                              </p>
                            </div>
                            <div
                              class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
                            >
                              <h3 class="text-sm font-bold">Time Zone</h3>
                              <p
                                class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
                              >
                                {currentError.time_zone}
                              </p>
                            </div>
                            <div
                              class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
                            >
                              <h3 class="text-sm font-bold">Referrer</h3>
                              <p
                                class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
                              >
                                {currentError.referrer || "-"}
                              </p>
                            </div>
                            <div
                              class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
                            >
                              <h3 class="text-sm font-bold">App version</h3>
                              <p
                                class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
                              >
                                {currentError.app_version}
                              </p>
                            </div>
                          </div>
                          <!-- Stacktrace details -->
                          <div class="flex flex-col gap-4 w-full">
                            <h3 class="text-sm font-bold">Stacktrace</h3>
                            <div class="flex flex-col gap-2 w-full">
                              {#await getStacktrace(currentError.id)}
                                <div
                                  class="flex flex-col items-center justify-center gap-2"
                                >
                                  <Loader />
                                </div>
                              {:then stacktrace}
                                <div class="flex flex-col gap-2">
                                  {#if stacktrace && stacktrace.codeContext}
                                    <div class="whitespace-pre-wrap">
                                      <CodeContextViewer
                                        codeContext={stacktrace.codeContext ||
                                          []}
                                        fileName={stacktrace.decodedFileName ||
                                          "unknown"}
                                      />
                                    </div>
                                  {:else}
                                    No stacktrace found
                                  {/if}
                                </div>
                              {/await}
                            </div>
                          </div>
                          <!-- User -->
                          <div class="flex flex-col gap-4 w-full">
                            <Card.Root class="w-full border-muted gap-4">
                              <Card.Header>
                                <h3 class="text-xl font-bold">User</h3>
                              </Card.Header>
                              <Card.Content>
                                {@const avatarQuery = currentError.session_email
                                  ? currentError.session_email
                                  : currentError.session_id}
                                <div class="flex flex-col gap-4">
                                  <div class="flex items-center gap-4">
                                    <img
                                      src="https://api.dicebear.com/9.x/thumbs/svg?seed={avatarQuery}"
                                      alt="Avatar"
                                      class="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                      <h3 class="text-sm font-bold">
                                        {currentError.session_email ||
                                          currentError.session_id}
                                      </h3>
                                      {#if !currentError.session_email}
                                        <p
                                          class="text-sm text-muted-foreground"
                                        >
                                          No email associated with this session
                                        </p>
                                      {/if}
                                    </div>
                                    <Button
                                      variant="outline"
                                      on:click={() => {
                                        const redirectTo = `/app/${group.group_app}/logs?page=1&q=${encodeURI(
                                          `session_id="${currentError.session_id}`
                                        )}"`;
                                        goto(redirectTo);
                                      }}
                                    >
                                      <SquareArrowOutUpRight
                                        class="mr-2 h-4 w-4"
                                      />
                                      <p>All Logs for this User</p>
                                    </Button>
                                  </div>
                                  <div class="flex gap-4">
                                    <div class="flex flex-col gap-2">
                                      <h3 class="text-sm font-bold">Browser</h3>
                                      <div class="flex gap-2 items-center">
                                        {#await getBrowserIcon(currentError.browser_name)}
                                          <Loader />
                                        {:then src}
                                          <img
                                            {src}
                                            alt="Browser Logo"
                                            class="w-5 h-5 rounded-full"
                                          />
                                        {/await}
                                        <p class="text-sm">
                                          {currentError.browser_name} ({currentError.browser_version})
                                        </p>
                                      </div>
                                    </div>
                                    <Separator orientation="vertical" />
                                    <div class="flex flex-col gap-2">
                                      <h3 class="text-sm font-bold">OS</h3>
                                      <p class="text-sm">
                                        {currentError.os_name} ({currentError.os_version})
                                      </p>
                                    </div>
                                    <Separator orientation="vertical" />
                                    <div class="flex flex-col gap-2">
                                      <h3 class="text-sm font-bold">
                                        Location
                                      </h3>
                                      <p class="text-sm">
                                        {currentError.time_zone}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </Card.Content>
                            </Card.Root>
                          </div>
                          <!-- Breadcrumbs -->
                          <div class="flex flex-col gap-4 w-full">
                            <h3 class="text-sm font-bold">Breadcrumbs</h3>
                            <div class="flex flex-col gap-2 w-full">
                              {#if currentError.breadcrumbs.length > 0}
                                {#if currentError.breadcrumbs.length > 3}
                                  <details>
                                    <summary class="cursor-pointer"
                                      >Show Breadcrumbs</summary
                                    >
                                    <div class="flex flex-col gap-2">
                                      {#each currentError.breadcrumbs as breadcrumb}
                                        <div
                                          class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
                                        >
                                          <h3 class="text-sm font-bold">
                                            {breadcrumb.category}
                                          </h3>
                                          <p
                                            class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
                                          >
                                            {breadcrumb.message}
                                          </p>
                                        </div>
                                      {/each}
                                    </div>
                                  </details>
                                {:else}
                                  <div class="flex flex-col gap-2">
                                    {#each currentError.breadcrumbs as breadcrumb}
                                      <div
                                        class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
                                      >
                                        <h3 class="text-sm font-bold">
                                          {breadcrumb.category}
                                        </h3>
                                        <p
                                          class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
                                        >
                                          {breadcrumb.message}
                                        </p>
                                      </div>
                                    {/each}
                                  </div>
                                {/if}
                              {:else}
                                <div class="flex flex-col gap-2">
                                  <div
                                    class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
                                  >
                                    <h3 class="text-sm font-bold">
                                      Breadcrumbs
                                    </h3>
                                    <p
                                      class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
                                    >
                                      No breadcrumbs found
                                    </p>
                                  </div>
                                </div>
                              {/if}
                            </div>
                          </div>
                          <!-- Custom -->
                          {#if currentError.custom}
                            <div class="flex flex-col gap-4 w-full">
                              <h3 class="text-sm font-bold">Custom</h3>
                              <div class="flex flex-col gap-2 w-full">
                                {#each Object.entries(currentError.custom) as [key, value]}
                                  <div
                                    class="flex flex-col gap-2 w-full px-4 py-2 rounded-md bg-muted"
                                  >
                                    <h3 class="text-sm font-bold">
                                      {key}
                                    </h3>
                                    <p
                                      class="text-sm capitalize text-muted-foreground"
                                    >
                                      {value}
                                    </p>
                                  </div>
                                {/each}
                              </div>
                            </div>
                          {/if}
                        </div>
                      {/if}
                    </div>
                  </Tab.Content>
                  <Tab.Content value="events">
                    <div class="flex flex-col gap-4">
                      <h3 class="text-sm font-bold">Discussion</h3>
                    </div>
                  </Tab.Content>
                  <Tab.Content value="metrics">
                    <div class="flex flex-col gap-4">
                      <h3 class="text-sm font-bold">Metrics</h3>
                    </div>
                  </Tab.Content>
                  <Tab.Content value="logs">
                    <div class="flex flex-col gap-4">
                      <h3 class="text-sm font-bold">Logs</h3>
                    </div>
                  </Tab.Content>
                </div>
              </Tab.Root>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  {/if}
</div>
