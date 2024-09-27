<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import ExplainFilter from "./explain-filter.svelte";

  export let open = false;
</script>

<Sheet.Root bind:open>
  <Sheet.Trigger asChild let:builder>
  </Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Header>
      <Sheet.Title>How to filter Logs</Sheet.Title>
      <Sheet.Description>
        All the logs unfiltered and ordered by creation date. the following
        filter syntax is supported
      </Sheet.Description>
    </Sheet.Header>
    <ExplainFilter />
  </Sheet.Content>
</Sheet.Root>
