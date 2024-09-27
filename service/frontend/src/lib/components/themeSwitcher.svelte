<script lang="ts">
  import { setMode, mode } from "mode-watcher";
  import * as Select from "$lib/components/ui/select";
  import { Sun, Moon } from "lucide-svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

  export let isCollapsed: boolean;

  function handleModeChange(e: { value: string }) {
    setMode((e.value as unknown) as "light" | "dark" | "system");
  }
</script>

{#if isCollapsed}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#if $mode === "light"}
        <Sun class="w-5 h-5" />
      {:else if $mode === "dark"}
        <Moon class="w-5 h-5" />
      {:else}
        <div class="w-5 h-5" />
      {/if}</DropdownMenu.Trigger
    >
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.Item on:click={() => setMode("light")}>
          Light
        </DropdownMenu.Item>
        <DropdownMenu.Item on:click={() => setMode("dark")}>
          Dark
        </DropdownMenu.Item>
        <DropdownMenu.Item on:click={() => setMode("system")}>
          System
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
{:else}
  <Select.Root onSelectedChange={handleModeChange}>
    <Select.Trigger>
      <Select.Value placeholder={$mode} />
    </Select.Trigger>
    <Select.Content>
      <Select.Item value="light">Light</Select.Item>
      <Select.Item value="dark">Dark</Select.Item>
      <Select.Item value="system">System</Select.Item>
    </Select.Content>
  </Select.Root>
{/if}
