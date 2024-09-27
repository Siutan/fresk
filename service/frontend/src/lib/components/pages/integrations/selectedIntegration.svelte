<script lang="ts">
  import { pbGet } from "$lib/queries/get";
  import { flyAndScale } from "$lib/utils";
  import type { RecordModel } from "pocketbase";
  import { fade } from "svelte/transition";
  import { integrationStore } from "$lib/stores/integration";
  import * as Card from "$lib/components/ui/card/index";
  import Button from "$lib/components/ui/button/button.svelte";
  import MetadataInput from "./metadataInput.svelte";

  let integration: RecordModel | undefined;

  const fetchIntegration = async (name: string) => {
    integration = await pbGet.getIntegrationByName(name);
  };

  integrationStore.subscribe(async (service) => {
    if (!service.selected) return;
    await fetchIntegration(service.selected);
  });
</script>

<div
  class="flex flex-col items-center justify-center gap-4 w-full p-5"
  in:flyAndScale={{ y: 20, x: 0, start: 0.95, duration: 150 }}
  out:fade={{ duration: 150 }}
>
  {#if !integration}
    <h2 class="text-2xl font-bold">Select an integration</h2>
  {:else}
    <div class="w-full flex flex-col gap-4">
      <h2 class="text-2xl font-bold">{integration.service_name}</h2>
      <Card.Root>
        <Card.Header>
          <Card.Title>Integration Settings</Card.Title>
          <Card.Description>Configure your integration</Card.Description>
        </Card.Header>
        <Card.Content>
          <form>
            <div class="flex flex-col gap-4">
              {#each Object.keys(integration.meta_data) as key}
                <MetadataInput
                  inputName={key}
                  inputValue={integration.meta_data[key]}
                />
              {/each}
            </div>
          </form>
        </Card.Content>
        <Card.Footer>
          <Button type="submit">Save</Button>
        </Card.Footer>
      </Card.Root>
    </div>
  {/if}
</div>
