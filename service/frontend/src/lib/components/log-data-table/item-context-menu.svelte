<script lang="ts">
  import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
  import { createEventDispatcher } from "svelte";
  import { isInt } from "$lib/utils";

  export let triggerText: string;
  export let rowLabel: string;
  export let value: string;

  const dispatch = createEventDispatcher();

  const handleClick = () => {
    // if value is number, don't wrap it in quotes
    console.log({
      value,
      isInt: isInt(value),
      type: typeof value,
    });
    if (typeof value === "number" && isInt(value)) {
      const query = `${rowLabel}=${value}`;
      dispatch("add-filter-query", { value: query });
      return;
    }
    const query = `${rowLabel}="${value}"`;
    dispatch("add-filter-query", { value: query });
  };
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger>
    {triggerText}
  </ContextMenu.Trigger>
  <ContextMenu.Content class="w-64">
    <ContextMenu.Item inset on:click={handleClick}>
      Add to filter query
    </ContextMenu.Item>
  </ContextMenu.Content>
</ContextMenu.Root>
