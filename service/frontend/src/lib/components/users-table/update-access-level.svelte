<script lang="ts">
  import * as Select from "$lib/components/ui/select";
  import { pbUpdate } from "$lib/queries/update";
  import { currentUser } from "$lib/stores/user";
  import { toast } from "svelte-sonner";
  import { writable } from "svelte/store";

  export let id: string;
  export let access_level: string;

  const selectedValue = writable({
    label: access_level,
    value: access_level,
  });

  async function updateAccessLevel(e: { value: string } | undefined) {
    if (!e) return;
    if ($currentUser.id === id) {
      toast.error("You cannot change your own access level");
      selectedValue.set({ label: access_level, value: access_level });
      return;
    }
    const { data, error } = await pbUpdate.updateUserAccessLevel(id, {
        access_level: e.value,
    });

    if (error || !data) {
      toast.error("Failed to update access level");
      selectedValue.set({ label: access_level, value: access_level });
      return;
    }

    toast.success("Access level updated");
    access_level = e.value;
  }
</script>

<Select.Root
  onSelectedChange={updateAccessLevel}
  disabled={$currentUser.id === id}
  bind:selected={$selectedValue}
>
  <Select.Trigger>
    <Select.Value placeholder={$selectedValue.value} />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="0">0</Select.Item>
    <Select.Item value="1">1</Select.Item>
    <Select.Item value="2">2</Select.Item>
  </Select.Content>
</Select.Root>
