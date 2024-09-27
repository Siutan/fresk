<script lang="ts">
  import { Button } from "./ui/button";
  import { cn } from "$lib/utils.js";
  import * as Tooltip from "./ui/tooltip/";
  import { page } from "$app/stores";
  import type { Route } from "$lib/types/Route";

  export let isCollapsed: boolean;
  export let routes: Route[];
</script>

<div
  data-collapsed={isCollapsed}
  class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
>
  <nav
    class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
  >
    {#each routes as route}
      {#if isCollapsed}
        <Tooltip.Root openDelay={0}>
          <Tooltip.Trigger asChild let:builder>
            <Button
              href={route.route}
              builders={[builder]}
              variant={route.route === $page.url.pathname ? "default" : "ghost"}
              size="icon"
            >
              <svelte:component
                this={route.icon}
                class="size-4"
                aria-hidden="true"
              />
              <span class="sr-only">{route.title}</span>
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content side="right" class="flex items-center gap-4">
            {route.title}
            {#if route.label}
              <span class="text-muted-foreground ml-auto">
                {route.label}
              </span>
            {/if}
          </Tooltip.Content>
        </Tooltip.Root>
      {:else}
        <Button
          href={route.route}
          variant={route.route === $page.url.pathname ? "default" : "ghost"}
          size="sm"
          class={"justify-start"}
        >
          <svelte:component
            this={route.icon}
            class="mr-2 size-4"
            aria-hidden="true"
          />
          {route.title}
          {#if route.label}
            <span
              class={cn("ml-auto", {
                "text-background dark:text-white": route.variant === "default",
              })}
            >
              {route.label}
            </span>
          {/if}
        </Button>
      {/if}
    {/each}
  </nav>
</div>
