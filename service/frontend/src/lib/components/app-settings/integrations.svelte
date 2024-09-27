<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Accordion from "$lib/components/ui/accordion/index.js";
  import Input from "../ui/input/input.svelte";

  export let integrations: any;
</script>

<Card.Root class="w-full bg-muted/40 border-muted">
  <Card.Header>
    <div class="flex flex-col w-full items-start justify-start gap-2">
      <Card.Title>Integrations</Card.Title>
      <Card.Description>Manage integrations for this app</Card.Description>
    </div>
  </Card.Header>
  <Card.Content>
    <div class="flex flex-col gap-2">
      <Accordion.Root class="w-full">
        {#if integrations.length > 0}
          {#each integrations as integration}
            <Accordion.Item value={integration.id}>
              <Accordion.Trigger>{integration.service_name}</Accordion.Trigger>
              <Accordion.Content>
                <div class="flex flex-col gap-2">
                  <div class="text-sm">
                    {#each Object.entries(integration.meta_data) as [key, value]}
                      <div class="flex flex-col items-start gap-2">
                        <div class="font-semibold">{key}</div>
                        <Input {value} />
                      </div>
                    {/each}
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          {/each}
        {/if}
      </Accordion.Root>
    </div>
  </Card.Content>
</Card.Root>
