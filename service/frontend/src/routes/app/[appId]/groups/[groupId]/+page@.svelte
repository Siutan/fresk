<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Tab from "$lib/components/ui/tabs/index.js";

  import type { PageData } from "./$types";
  import LogGroupInfoCard from "$lib/components/group/log-group-info-card.svelte";
  import LogGroupHeaderCard from "$lib/components/group/log-group-header-card.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import TagPillsContainer from "$lib/components/log-details/tag-pills-container.svelte";
  import StacktraceContainer from "$lib/components/log-details/stacktrace-container.svelte";
  import UserDetails from "$lib/components/log-details/user-details.svelte";
  import BreadcrumbsContainer from "$lib/components/log-details/breadcrumbs-container.svelte";
  import CustomFields from "$lib/components/log-details/custom-fields.svelte";
  import LogDetailsHeader from "$lib/components/log-details/log-details-header.svelte";

  export let data: PageData;

  const { group, pageBreakdown, browserBreakdown, osBreakdown, errors } = data;

  let currentLogIndex = errors ? errors.length - 1 : 0;

  const cycleLogs = (event: CustomEvent<string>) => {
    if (!errors) return;

    switch (event.detail) {
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
                          <LogDetailsHeader
                            {currentError}
                            bind:currentLogIndex
                            totalErrors={errors.length}
                            on:click={cycleLogs}
                          />
                          <Separator />

                          <!-- Tag Pills -->
                          <TagPillsContainer {currentError} />
                          <Separator />
                          <!-- Stacktrace details -->
                          <StacktraceContainer {currentError} />
                          <Separator />

                          <!-- User -->
                          <UserDetails
                            {currentError}
                            groupAppId={group.group_app}
                          />
                          <Separator />

                          <!-- Breadcrumbs -->
                          <BreadcrumbsContainer {currentError} />
                          <Separator />

                          <!-- Custom -->
                          <CustomFields {currentError} />
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
