<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { pbUpdate } from "$lib/queries/update";
  import { toast } from "svelte-sonner";
  import { invalidate } from "$app/navigation";
  import isURL from "validator/lib/isURL";

  import Input from "../ui/input/input.svelte";
  import Button from "../ui/button/button.svelte";

  export let app: any;

  let originalApp = { ...app };

  const handleStatusChange = async (value: boolean) => {
    const { data, error } = await pbUpdate.updateApp(app.id, { active: value });
    if (error || !data) {
      toast.error("Failed to update app status");
      app.active = !value;
      return;
    }
    toast.success("App status updated");
    await invalidate("app:app-server-load");
  };

  const handleSave = async () => {
    if (app.link && !isURL(app.link)) {
      toast.error("Invalid URL");
      return;
    }
    const { data, error } = await pbUpdate.updateApp(app.id, {
      app_name: app.app_name,
      link: app.link,
    });
    if (error || !data) {
      toast.error("Failed to update app");
      return;
    }
    toast.success("App updated");
    originalApp = { ...app };
    await invalidate("app:app-server-load");
  };

  $: isChanged =
    app.app_name !== originalApp.app_name ||
    app.link !== originalApp.link ||
    app.active !== originalApp.active;
</script>

<Card.Root class="w-full bg-muted/40 border-muted">
  <Card.Header>
    <div class="flex flex-col w-full items-start justify-start gap-2">
      <Card.Title>General</Card.Title>
      <div class="text-sm">General settings for this app</div>
    </div>
  </Card.Header>
  <Card.Content>
    <div class="flex flex-col gap-2">
      <form
        class="w-full flex flex-col gap-2"
        on:submit|preventDefault={handleSave}
      >
        <div class="text-sm">App Name</div>
        <div class="flex flex-col gap-2">
          <Input bind:value={app.app_name} />
        </div>
        <div class="text-sm">App Link</div>
        <div class="flex flex-col gap-2">
          <Input bind:value={app.link} />
        </div>
        <Button type="submit" variant="outline" disabled={!isChanged}
          >Save Changes</Button
        >
      </form>
      <Separator />
      <div class="text-lg font-semibold text-rose-500">Danger Zone</div>
      <div class="text-sm">Status</div>
      <Switch
        id="status"
        bind:checked={app.active}
        onCheckedChange={handleStatusChange}
      />
    </div>
  </Card.Content>
</Card.Root>
