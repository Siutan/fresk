<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Sheet.Root>
  <Sheet.Header>
    <Sheet.Title>Create Integration</Sheet.Title>
  </Sheet.Header>
  <Sheet.Content>
    <Card.Root class="w-full bg-muted/40 border-muted">
      <Card.Header>
        <div class="flex flex-col w-full items-start justify-start gap-2">
          <Card.Title>Integration Name</Card.Title>
          <Card.Description>Integration Description</Card.Description>
        </div>
      </Card.Header>
      <Card.Content>
        <div class="flex flex-col gap-2">
          <div class="text-sm">
            <div class="flex flex-col gap-2">
              <div class="text-sm">Integration Name</div>
              <div class="text-sm">Integration Description</div>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  </Sheet.Content>
  <Sheet.Footer>
    hey
  </Sheet.Footer>
</Sheet.Root>
