<script lang="ts">
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button } from "$lib/components/ui/button";
  import { pbGet } from "$lib/queries/get";
  import Input from "../ui/input/input.svelte";
  import { Search } from "lucide-svelte";
  import LogSheet from "../log-sheet.svelte";
  import SelectedLog from "$lib/components/logs/selectedLog.svelte";
  import { logStore } from "$lib/stores/logStore";
  import { onMount } from "svelte";
  import FilterSheet from "../filter-sheet.svelte";
  import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";
  import { ChevronLeft, ChevronRight } from "lucide-svelte";
  import Loader from "../loader.svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import ItemContextMenu from "../log-data-table/item-context-menu.svelte";
  import AssignMemberSelect from "./assign-member-select.svelte";
  import type { Member } from "$lib/types/member";

  export let appId: string;

  let currentPage = 1;
  let perPage = 15;
  let searchQuery = "";
  let logs: any[] = [];
  let totalLogs = 0;
  let totalPages = 0;
  let loading = true;
  let openSheet = false;
  let openFilterSheet = false;
  let members: Member[] = [];

  $: searchParams = $page.url.searchParams;

  $: fetchLogs(currentPage, perPage, searchQuery);

  async function fetchLogs(
    currentPage: number,
    perPage: number,
    query: string
  ) {
    loading = true;
    // update search params
    if (query) {
      searchParams.set("q", query);
    } else {
      searchParams.delete("q");
    }
    searchParams.set("page", currentPage.toString());
    if (browser) {
      goto(`?${searchParams.toString()}`, { replaceState: true });
    }

    try {
      if (query) {
        const { data, error } = await pbGet.getLogGroupsByCustomQuery(
          appId,
          query
        );
        if (error) throw error;
        logs = data?.items || [];
        totalLogs = data?.totalItems || 0;
        totalPages = data?.totalPages || 0;
      } else {
        const { data, error } = await pbGet.getLogGroupsByAppId(
          appId,
          currentPage,
          perPage
        );
        if (error) throw error;
        logs = data?.items || [];
        totalLogs = data?.totalItems || 0;
        totalPages = data?.totalPages || 0;
      }
    } catch (error) {
      logs = [];
    } finally {
      loading = false;
    }
  }

  function handleSearch(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    searchQuery = formData.get("search") as string;
    currentPage = 1;
    fetchLogs(currentPage, perPage, searchQuery);
  }

  function viewLog(logId: string) {
    logStore.setLog(logId);
    openSheet = true;
  }

  function handleAddFilterQuery(e: CustomEvent<{ value: string }>) {
    const newQuery = e.detail.value;
    if (searchQuery) {
      const sortIndex = searchQuery.indexOf("?sort");
      if (sortIndex !== -1) {
        searchQuery =
          searchQuery.slice(0, sortIndex) +
          `&&${newQuery}` +
          searchQuery.slice(sortIndex);
      } else {
        searchQuery += `&&${newQuery}`;
      }
    } else {
      searchQuery = newQuery;
    }
  }

  async function fetchMembers() {
    const { data, error } = await pbGet.getAllMembers();
    if (error || !data) return;
    members = data;
  }

  onMount(() => {
    fetchMembers();
    searchQuery = searchParams.get("q") || "";
    currentPage = parseInt(searchParams.get("page") || "1", 10);
    fetchLogs(currentPage, perPage, searchQuery);
  });
</script>

<LogSheet bind:open={openSheet}>
  <div slot="content">
    <div class="flex flex-col gap-4">
      <SelectedLog />
    </div>
  </div>
</LogSheet>

<FilterSheet bind:open={openFilterSheet} />

<div class="flex gap-4 mb-2">
  <form class="w-full flex gap-2" on:submit|preventDefault={handleSearch}>
    <div class="relative ml-auto flex-1">
      <Search class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
      <Input
        type="search"
        name="search"
        placeholder="Search..."
        autocomplete="off"
        class="bg-background w-full rounded-lg pl-8"
        value={searchQuery}
      />
    </div>
    <Button type="submit" variant="outline">Search</Button>
    <Button on:click={() => (openFilterSheet = true)} variant="outline"
      >How to filter?</Button
    >
  </form>
</div>

{#if loading}
  <div class="flex flex-col items-center justify-center gap-4 w-full h-[36rem]">
    <Loader />
  </div>
{:else if logs.length === 0}
  <div class="flex flex-col items-center justify-center gap-4 w-full h-[36rem]">
    <h2 class="text-2xl">No logs found</h2>
  </div>
{:else if logs?.length > 0}
  <ScrollArea class="h-[36rem] overflow-auto">
    <Table.Root class="relative min-w-max max-w-7xl" width="100vw">
      <Table.Header class="sticky top-0 z-10 bg-primary-foreground">
        <Table.Row class="border-background">
          <Table.Head class="w-[100px]">Group Id</Table.Head>
          <Table.Head class="w-[200px]">Log Type</Table.Head>
          <Table.Head class="w-44">Value</Table.Head>
          <Table.Head class="">Notes</Table.Head>
          <Table.Head class="w-[100px]">Assignee</Table.Head>
          <Table.Head class="w-[100px]">Timestamp</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each logs as row (row.id)}
          <Table.Row class="border-muted">
            <Table.Cell>
              <Button
                variant="ghost"
                size="sm"
                on:click={() => viewLog(row.id)}
              >
                {row.id}
              </Button>
            </Table.Cell>
            <Table.Cell>
              <ItemContextMenu
                triggerText={row.log_type}
                value={row.log_type}
                rowLabel="log_type"
                on:add-filter-query={handleAddFilterQuery}
              />
            </Table.Cell>
            <Table.Cell>
              <p class="w-44 truncate">
                <ItemContextMenu
                  triggerText={row.value}
                  value={row.value}
                  rowLabel="value"
                  on:add-filter-query={handleAddFilterQuery}
                />
              </p>
            </Table.Cell>
            <Table.Cell>
              <ItemContextMenu
                triggerText={row.note}
                value={row.note}
                rowLabel="note"
                on:add-filter-query={handleAddFilterQuery}
              />
            </Table.Cell>
            <Table.Cell>
              {@const selectedMember = row.expand ? row.expand.assignee : null}
              <AssignMemberSelect
                  {members}
                  selectedMember={selectedMember}
                  logGroupId={row.id}
                />
            </Table.Cell>
            <Table.Cell class="font-medium">
              <ItemContextMenu
                triggerText={new Date(row.created).toLocaleString()}
                value={row.created}
                rowLabel="created"
                on:add-filter-query={handleAddFilterQuery}
              />
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </ScrollArea>
{/if}

<div class="w-full justify-end flex gap-4 items-center mt-4">
  <span class="text-muted-foreground text-sm"> {totalLogs} total logs</span>
  <Button
    on:click={() => currentPage > 1 && currentPage--}
    disabled={currentPage === 1}
    variant="ghost"
    size="icon"
  >
    <ChevronLeft />
  </Button>
  <div class="flex gap-2">
    {#if totalPages > 10}
      <Button
        on:click={() => (currentPage = 1)}
        disabled={currentPage === 1}
        variant="ghost"
        size="icon">1</Button
      >
      {#if currentPage > 5}
        <span>...</span>
      {/if}
      {#each Array(Math.min(totalPages, currentPage + 2)) as _, i}
        {#if i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1}
          <Button
            on:click={() => (currentPage = i + 1)}
            class={i + 1 === currentPage
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"}
          >
            {i + 1}
          </Button>
        {/if}
      {/each}
      {#if currentPage < totalPages - 4}
        <span>...</span>
      {/if}
      <Button
        on:click={() => (currentPage = totalPages)}
        disabled={currentPage === totalPages}
        variant="ghost"
        size="icon">{totalPages}</Button
      >
    {:else}
      {#each Array(totalPages) as _, i}
        <Button
          on:click={() => (currentPage = i + 1)}
          class={i + 1 === currentPage
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"}
        >
          {i + 1}
        </Button>
      {/each}
    {/if}
  </div>
  <Button
    on:click={() => currentPage++}
    disabled={currentPage === totalPages || logs.length < perPage}
    variant="ghost"
    size="icon"
  >
    <ChevronRight />
  </Button>
</div>
