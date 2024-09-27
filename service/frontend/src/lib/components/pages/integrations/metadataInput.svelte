<script lang="ts">
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";

  export let inputName: string;
  export let inputValue: string;

</script>

<div class="flex flex-col gap-2">
  <Label for={`${inputName}_metadata`}>Metadata</Label>
  <Input
    type="text"
    name={`${inputName}_metadata`}
    placeholder="name"
    bind:value={inputValue}
  />
</div>
