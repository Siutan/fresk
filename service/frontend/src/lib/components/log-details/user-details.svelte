<script lang="ts">
    import { goto } from "$app/navigation";
    import { getBrowserIcon } from "$lib/helpers/browser-icon-parser";
    import type { Log } from "$lib/types/Log";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import Loader from "$lib/components/loader.svelte";
    import * as Card from "$lib/components/ui/card/index.js";
    import { SquareArrowOutUpRight } from "lucide-svelte";

    export let currentError: Log;
    export let groupAppId: string;
</script>

<div class="flex flex-col gap-4 w-full">
    <Card.Root class="w-full border-muted gap-4">
      <Card.Header>
        <h3 class="text-xl font-bold">User</h3>
      </Card.Header>
      <Card.Content>
        {@const avatarQuery = currentError.session_email
          ? currentError.session_email
          : currentError.session_id}
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-4">
            <img
              src="https://api.dicebear.com/9.x/thumbs/svg?seed={avatarQuery}"
              alt="Avatar"
              class="w-10 h-10 rounded-full"
            />
            <div>
              <h3 class="text-sm font-bold">
                {currentError.session_email ||
                  currentError.session_id}
              </h3>
              {#if !currentError.session_email}
                <p
                  class="text-sm text-muted-foreground"
                >
                  No email associated with this session
                </p>
              {/if}
            </div>
            <Button
              variant="outline"
              on:click={() => {
                const redirectTo = `/app/${groupAppId}/logs?page=1&q=${encodeURI(
                  `session_id="${currentError.session_id}`
                )}"`;
                goto(redirectTo);
              }}
            >
              <SquareArrowOutUpRight
                class="mr-2 h-4 w-4"
              />
              <p>All Logs for this User</p>
            </Button>
          </div>
          <div class="flex gap-4">
            <div class="flex flex-col gap-2">
              <h3 class="text-sm font-bold">Browser</h3>
              <div class="flex gap-2 items-center">
                {#await getBrowserIcon(currentError.browser_name)}
                  <Loader />
                {:then src}
                  <img
                    {src}
                    alt="Browser Logo"
                    class="w-5 h-5 rounded-full"
                  />
                {/await}
                <p class="text-sm">
                  {currentError.browser_name} ({currentError.browser_version})
                </p>
              </div>
            </div>
            <Separator orientation="vertical" />
            <div class="flex flex-col gap-2">
              <h3 class="text-sm font-bold">OS</h3>
              <p class="text-sm">
                {currentError.os_name} ({currentError.os_version})
              </p>
            </div>
            <Separator orientation="vertical" />
            <div class="flex flex-col gap-2">
              <h3 class="text-sm font-bold">
                Location
              </h3>
              <p class="text-sm">
                {currentError.time_zone}
              </p>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  </div>