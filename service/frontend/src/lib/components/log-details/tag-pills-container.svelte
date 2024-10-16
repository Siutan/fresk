<script lang="ts">
  import DataPill from "$lib/components/log-details/data-pill.svelte";
  import type { Log } from "$lib/types/Log";
  export let currentError: Log;
</script>

<div class="flex flex-wrap gap-4 w-full">
  <DataPill heading="Device" content={currentError.device_type} />
  <DataPill heading="Operating System" content={currentError.os_name} />
  <DataPill heading="Browser" content={currentError.browser_name} />
  <DataPill heading="Network Type" content={currentError.network_type} />
  <DataPill heading="Viewport Size" content={currentError.viewport_size} />
  <DataPill
    heading="Screen Resolution"
    content={currentError.screen_resolution}
  />
  <DataPill heading="Language" content={currentError.language} />
  <DataPill heading="Time Zone" content={currentError.time_zone} />
  <DataPill heading="Referrer" content={currentError.referrer || "-"} />
  <DataPill heading="App version" content={currentError.app_version} />
</div>
