<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";


  import { ArrowRightIcon } from "lucide-svelte";
  import Button from "../../ui/button/button.svelte";
  import { goto } from "$app/navigation";

  export let logsByPage: { pageId: string; count: number }[];
</script>

<Card.Root class="w-full bg-muted/40 border-muted">
  <Card.Header class="py-4">
    <div class="flex w-full items-center justify-between">
      <Card.Title>Logs by Page</Card.Title>
      <Button variant="ghost"
        >See all
        <ArrowRightIcon />
      </Button>
    </div>
  </Card.Header>
  <Card.Content>
    <ScrollArea class="h-40 overflow-auto">
      <Table.Root width="100vw">
        <Table.Caption>Logs by page for the last 30 days</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>Page ID</Table.Head>
            <Table.Head>Count</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each logsByPage as row (row.pageId)}
            <Table.Row>
              <Table.Cell class="font-medium">{row.pageId}</Table.Cell>
              <Table.Cell class="font-medium">{row.count}</Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </ScrollArea>
  </Card.Content>
</Card.Root>
