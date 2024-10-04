<script lang="ts">
  import {
    createTable,
    Render,
    Subscribe,
    createRender,
  } from "svelte-headless-table";
  import { writable } from "svelte/store";
  import * as Table from "$lib/components/ui/table";
  import DeleteTableAction from "./delete-table-action.svelte";
  import Avatar from "./avatar.svelte";
  import Button from "../ui/button/button.svelte";
  import {
    addPagination,
    addSortBy,
    addTableFilter,
    addHiddenColumns,
    addSelectedRows,
  } from "svelte-headless-table/plugins";
  import ChevronDown from "lucide-svelte/icons/chevron-down";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import DataTableCheckbox from "./table-checkbox.svelte";
  import UpdateAccessLevel from "./update-access-level.svelte";

  import { ArrowUpDown } from "lucide-svelte";
  import Input from "../ui/input/input.svelte";
  import { deleteLogs } from "$lib/stores/test-store";
  import type { Member } from "$lib/types/member";
  import { currentUser } from "$lib/stores/user";
  import { pbDelete } from "$lib/queries/delete";
  import { toast } from "svelte-sonner";
  import { invalidate } from "$app/navigation";

  export let data: Member[];

  const tableData = writable(data);

  $: $tableData = data;

  const table = createTable(tableData, {
    page: addPagination(),
    sort: addSortBy({ disableMultiSort: true }),
    filter: addTableFilter({
      fn: ({ filterValue, value }) =>
        value.toLowerCase().includes(filterValue.toLowerCase()),
    }),
    hide: addHiddenColumns(),
    select: addSelectedRows(),
  });

  const columns = table.createColumns([
    table.column({
      accessor: "id",
      header: (_, { pluginStates }) => {
        const { allPageRowsSelected } = pluginStates.select;
        return createRender(DataTableCheckbox, {
          checked: allPageRowsSelected,
        });
      },
      cell: ({ row }, { pluginStates }) => {
        const { getRowState } = pluginStates.select;
        const { isSelected } = getRowState(row);

        return createRender(DataTableCheckbox, {
          checked: isSelected,
        });
      },
    }),
    table.column({
      accessor: "avatar",
      header: "",
      cell: ({ value }) => {
        return createRender(Avatar, { seed: value });
      },
    }),
    table.column({
      accessor: "name",
      header: "Name",
    }),
    table.column({
      accessor: "email",
      header: "User Email",
    }),
    table.column({
      accessor: "access_level",
      header: "Access level",
      cell: ({ value, row }) => {
        return createRender(UpdateAccessLevel, { id: row.original.id, access_level: value });
      },
    }),
    table.column({
      accessor: "status",
      header: "Status",
    }),
    table.column({
      accessor: "created",
      header: "Joined",
      cell: ({ value }) => {
        return new Date(value).toLocaleDateString();
      },
    }),
    table.column({
      accessor: ({ id }) => id,
      header: "",
      cell: ({ value }) => {
        return createRender(DeleteTableAction, { id: value });
      },
    }),
  ]);

  const {
    headerRows,
    pageRows,
    tableAttrs,
    tableBodyAttrs,
    pluginStates,
    flatColumns,
  } = table.createViewModel(columns);

  const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
  const { filterValue } = pluginStates.filter;

  const { hiddenColumnIds } = pluginStates.hide;
  const { selectedDataIds } = pluginStates.select;

  const ids = flatColumns.map((col) => col.id);
  const hideForId = Object.fromEntries(ids.map((id) => [id, true]));

  $: $hiddenColumnIds = Object.entries(hideForId)
    .filter(([, hide]) => !hide)
    .map(([id]) => id);

  const hidableCols = ["created", "status"];

  const handleDelete = async () => {
    const selectedIds = Object.keys($selectedDataIds).filter(
      (id) => $selectedDataIds[id] && id !== $currentUser.id
    );
    const rowsToDelete = selectedIds.map((id) => $tableData[parseInt(id)].id);

    for (const id of rowsToDelete) {
      const { data, error } = await pbDelete.deleteMember(id);
      if (error || !data) {
        console.error("Error deleting member:", error);
        toast.error("Error deleting member");
        return;
      }
    }

    $selectedDataIds = {};
    invalidate("app:users-server-load");
    toast.success("Users deleted successfully");
  };
</script>

<div class="flex items-center justify-between py-4">
  <Input
    class="max-w-sm"
    placeholder="Filter everything..."
    type="text"
    bind:value={$filterValue}
  />
  <div class="flex gap-2">
    <Button
      variant="destructive"
      class="ml-auto"
      on:click={handleDelete}
      disabled={Object.keys($selectedDataIds).length === 0}
      >Remove Selected</Button
    >

    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button variant="outline" class="ml-auto" builders={[builder]}>
          Columns <ChevronDown class="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {#each flatColumns as col}
          {#if hidableCols.includes(col.id)}
            <DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
              {col.header}
            </DropdownMenu.CheckboxItem>
          {/if}
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</div>

<div class="rounded-md border border-muted">
  <Table.Root {...$tableAttrs}>
    <Table.Header>
      {#each $headerRows as headerRow}
        <Subscribe rowAttrs={headerRow.attrs()}>
          <Table.Row>
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe
                attrs={cell.attrs()}
                let:attrs
                props={cell.props()}
                let:props
              >
                <Table.Head {...attrs} class="[&:has([role=checkbox])]:pl-3">
                  {#if cell.id && cell.id !== "id" && cell.id !== "avatar"}
                    <Button
                      variant="ghost"
                      on:click={(e) => {
                        props.sort.toggle(e);
                      }}
                    >
                      <Render of={cell.render()} />
                      <ArrowUpDown class={"ml-2 h-4 w-4"} />
                    </Button>
                  {:else}
                    <Render of={cell.render()} />
                  {/if}
                </Table.Head>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Header>
    <Table.Body {...$tableBodyAttrs}>
      {#each $pageRows as row (row.id)}
        <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
          <Table.Row
            {...rowAttrs}
            data-state={$selectedDataIds[row.id] && "selected"}
          >
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                <Table.Cell {...attrs}>
                  <Render of={cell.render()} />
                </Table.Cell>
              </Subscribe>
            {/each}
          </Table.Row>
        </Subscribe>
      {/each}
    </Table.Body>
  </Table.Root>
  <div class="flex items-center justify-end space-x-4 p-4">
    <div class="text-muted-foreground flex-1 text-sm">
      {Object.keys($selectedDataIds).length} of{" "}
      {$tableData.length} row(s) selected.
    </div>
    <Button
      variant="outline"
      size="sm"
      on:click={() => ($pageIndex = $pageIndex - 1)}
      disabled={!$hasPreviousPage}>Previous</Button
    >
    <Button
      variant="outline"
      size="sm"
      disabled={!$hasNextPage}
      on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
    >
  </div>
</div>
