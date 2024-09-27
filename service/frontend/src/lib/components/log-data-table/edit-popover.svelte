<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import isEmail from "validator/lib/isEmail";

  export let value: string;

  let newEmail = "";

  let popoverOpen = false;
  let openDialog = false;

  const saveChanges = () => {
    value = newEmail;
    openDialog = false;
    popoverOpen = false;
  };

  const validateEmail = (email: string) => {
    return isEmail(email);
  };
</script>

<Popover.Root bind:open={popoverOpen} portal={null}>
  <Popover.Trigger asChild let:builder>
    <Button builders={[builder]} variant="ghost">{value}</Button>
  </Popover.Trigger>
  <Popover.Content class="w-80">
    <div class="grid gap-4">
      <div class="space-y-2">
        <h4 class="font-medium leading-none">Change Email</h4>
        <p class="text-muted-foreground text-sm">
          This will update the user's email.
        </p>
      </div>
      <div class="grid gap-2">
        <div class="grid grid-cols-3 items-center gap-4">
          <Label for="maxHeight">New Email</Label>
          <Input id="maxHeight" bind:value={newEmail} class="col-span-2 h-8" />
        </div>
      </div>
      <div class="flex justify-end gap-4">
        <Popover.Close>Cancel</Popover.Close>
        <Button
          variant="destructive"
          on:click={() => {
            const isValid = validateEmail(newEmail);
            if (!isValid) {
              console.error("Invalid email");
              return;
            }
            openDialog = true;
          }}>Save</Button
        >
      </div>
    </div></Popover.Content
  >
</Popover.Root>

<Dialog.Root bind:open={openDialog}>
  <Dialog.Content class="sm:max-w-[425px]">
    <form on:submit={saveChanges}>
      <Dialog.Header>
        <Dialog.Title>You are about to change a user's email</Dialog.Title>
        <Dialog.Description>confirm this action</Dialog.Description>
      </Dialog.Header>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="old-email" class="text-right">Old Email</Label>
          <Input id="old-email" {value} readonly class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="new-email" class="text-right">New Email</Label>
          <Input id="new-email" value={newEmail} readonly class="col-span-3" />
        </div>
      </div>
      <Dialog.Footer>
        <Button
          on:click={() => {
            newEmail = "";
            openDialog = false;
            popoverOpen = false;
          }}>Cancel</Button
        >
        <Button type="submit" variant="destructive">Change Email</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
