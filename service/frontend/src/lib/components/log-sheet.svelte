<script lang="ts">
    import * as Sheet from "$lib/components/ui/sheet/index.js";

    export let open = false;
  </script>
   
  <Sheet.Root bind:open>
    <Sheet.Content side="right" class="bg-primary-foreground border-muted">
      <Sheet.Header>
        <Sheet.Title>
            <slot name="title" />
        </Sheet.Title>
        <Sheet.Description>
            <slot name="description" />
        </Sheet.Description>
      </Sheet.Header>
      <div class="h-full">
        <slot name="content" />
      </div>
    </Sheet.Content>
  </Sheet.Root>