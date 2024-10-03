<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  import { getFileUrl } from "$lib/pocketbase";
  import { pbUpdate } from "$lib/queries/update";
  import type { Member } from "$lib/types/member";
  import type { Selected } from "bits-ui";

  export let logGroupId: string;
  export let members: Member[] = [];
  export let selectedMember: Member | null = null;

  const getMemberAvatar = async (
    collection: string,
    memberId: string,
    filename: string
  ) => {
    const url = await getFileUrl(collection, memberId, filename);
    if (url) {
      return url;
    }
  };

  const handleFallback = (event: Event, memberName: string) => {
    const eventTarget = event.target as HTMLImageElement;
    eventTarget.src = `https://api.dicebear.com/9.x/thumbs/svg?seed=${memberName}`;
  };

  const handleSelect = async (member: Selected<string> | undefined) => {
    if (!member) return;
    if (member.value === "clear") {
      await handleClear();
      return;
    }
    selectedMember = members.find((m) => m.id === member.value) || null;
    if (!selectedMember) return;

    const { data, error } = await pbUpdate.updateAssignee(logGroupId, {
      assignee: selectedMember.id,
    });
    if (error || !data) return;
  };

  const handleClear = async () => {
    selectedMember = null;
    const { data, error } = await pbUpdate.updateAssignee(logGroupId, {
      assignee: null,
    });
    if (error || !data) return;
  };
</script>

<div class="flex flex-col gap-4">
  <Select.Root
    portal={null}
    selected={selectedMember
      ? { label: selectedMember.name, value: selectedMember.id }
      : null}
    onSelectedChange={handleSelect}
  >
    <Select.Trigger class="w-full">
      <Select.Value placeholder="Select a member" />
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        <Select.Label>Members</Select.Label>
        {#each members as member}
          <Select.Item value={member.id} label={member.name}>
            <div class="flex items-center gap-2 w-full">
              {#await getMemberAvatar(member.collectionId, member.id, member.avatar)}
                <div>loading...</div>
              {:then avatar}
                <img
                  src={avatar}
                  alt={member.name}
                  class="w-8 h-8 rounded-full"
                  on:error={(e) => handleFallback(e, member.name)}
                />
                <div class="flex flex-col">
                  <div class="text-sm">{member.name}</div>
                  <div class="text-xs text-muted-foreground">
                    {member.username}
                  </div>
                </div>
              {/await}
            </div>
          </Select.Item>
        {/each}
        <Select.Item value="clear" label="Clear Selection">
          <div class="flex items-center gap-2 w-full">
            <div class="text-sm">Clear Selection</div>
          </div>
        </Select.Item>
      </Select.Group>
    </Select.Content>
    <Select.Input name="Select Member" />
  </Select.Root>
</div>
