<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { pbDelete } from "$lib/queries/delete";
  import { invalidate } from "$app/navigation";
  import { currentUser } from "$lib/stores/user";
  import { toast } from "svelte-sonner";

  export let id: string;

  const handleDelete = async () => {
    if (!id) return;

    // sanity check to make sure the user is not trying to delete themselves
    if ($currentUser.id === id) return;

    const { data, error } = await pbDelete.deleteMember(id);

    if (error || !data) {
      console.error("Error deleting member:", error);
      toast.error("Error deleting member");
      return;
    }

    invalidate('app:users-server-load');
    toast.success("User deleted successfully");
  };
</script>

<AlertDialog.Root>
  {#if $currentUser.id !== id}
    <AlertDialog.Trigger
      class="bg-destructive/60 p-2 rounded-md hover:bg-destructive/80 duration-150"
    >
      Remove
    </AlertDialog.Trigger>
  {/if}
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete this user
        and remove their access to the system.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action on:click={handleDelete}>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
