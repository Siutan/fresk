<script lang="ts">
  import Textarea from "$lib/components/ui/textarea/textarea.svelte";

  export let blockName: string;
  export let blockValue: Record<string, number>;

  function sanitiseBlockName(name: string) {
    return name.replaceAll("_", " ");
  }
</script>

<div class="flex flex-col gap-4 w-full px-4 py-2">
  <h3 class="text-lg font-semibold capitalize">
    {sanitiseBlockName(blockName)}
  </h3>
  {#if blockName === "performance_metrics" && typeof blockValue === "object"}
    {#each Object.entries(blockValue) as [metricName, metricValue]}
      <div class="flex flex-col">
        <h4 class="text-md font-medium">{metricName}</h4>
        <Textarea
          value={metricValue ? metricValue.toString() : "N/A"}
          readonly={true}
          disabled={metricValue === undefined}
        ></Textarea>
      </div>
    {/each}
  {:else if blockName === "custom"}
    {#if blockValue}
      {#each Object.entries(blockValue) as [key, value]}
        <div class="flex flex-col">
          <h4 class="text-md font-medium">{key}</h4>
          <Textarea
            value={value ? value.toString() : "N/A"}
            readonly={true}
            disabled={value === undefined}
          ></Textarea>
        </div>
      {/each}
    {:else}
      <Textarea
        value={"N/A"}
        readonly={true}
        disabled={!blockValue}
      ></Textarea>
    {/if}
  {:else}
    <Textarea
      value={blockValue ? blockValue.toString() : "N/A"}
      readonly={true}
      disabled={!blockValue}
    ></Textarea>
  {/if}
</div>
