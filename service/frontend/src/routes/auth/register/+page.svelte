<script lang="ts">
  import { pb } from "$lib/pocketbase";
  import { config } from "$lib/stores/config";
  import { applyAction, enhance } from "$app/forms";
  import { Label } from "$lib/components/ui/label";
  import { Input } from "$lib/components/ui/input";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as Card from "$lib/components/ui/card/index";
  import { page } from "$app/stores";
  import { toast } from "svelte-sonner";

  const createToast = (title: string, description: string) =>
    toast.error(title, {
      description: description,
      duration: 3000,
      position: "top-center",
      //   dismissable: true,
      //   cancel: {
      //     label: "Close",
      //     onClick: () => {
      //       toast.dismiss();
      //     },
      //   }
    });

  $: if ($page.form) {
    createToast($page.form.errors.title, $page.form.errors.description);
  }
</script>

<div class="w-full h-screen flex flex-col items-center justify-center">
  <Card.Root>
    <Card.Header>
      <Card.Title>Welcome back!</Card.Title>
      <Card.Description>Please log in to continue</Card.Description>
    </Card.Header>
    <Card.Content>
      <form
        method="POST"
        class="w-96 flex flex-col gap-4 p-5"
        use:enhance={() => {
          return async ({ result }) => {
            pb.authStore.loadFromCookie(document.cookie);
            await applyAction(result);
          };
        }}
      >
        <div class="flex w-full max-w-sm flex-col gap-1.5">
          <Label for="email">Email</Label>
          <Input type="email" id="email" name="email" placeholder="email" />
        </div>
        <div class="flex w-full max-w-sm flex-col gap-1.5">
          <Label for="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="password"
          />
        </div>
        <div class="flex w-full max-w-sm flex-col gap-1.5">
          <Label for="passwordConfirm">Confirm Password</Label>
          <Input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            placeholder="confirm password"
          />
        </div>

        <Button type="submit">Register</Button>
      </form>
    </Card.Content>
    <Card.Footer>
      <a href="/auth/login" class="flex items-center gap-2">
        <Button variant="outline" class="gap-2">
          <p>Log in</p>
        </Button>
      </a></Card.Footer
    >
  </Card.Root>
</div>
