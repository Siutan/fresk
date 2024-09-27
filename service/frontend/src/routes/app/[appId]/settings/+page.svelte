<script lang="ts">
  import General from "$lib/components/app-settings/general.svelte";
  import Integrations from "$lib/components/app-settings/integrations.svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  const { app, integrations } = data;
</script>

<div class="w-full flex flex-col gap-4">
  <General app={app} />
  <Integrations integrations={integrations} />
</div>
