<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant="outline">Create Issue</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56">
    <DropdownMenu.Label>Choose a provider</DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.Group>
      <DropdownMenu.Item>
        <span>Notion</span>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        <span>Jira</span>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        <span>GitHub</span>
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
