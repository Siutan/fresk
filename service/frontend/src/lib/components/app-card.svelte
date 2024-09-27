<script lang="ts">
  import * as Card from "$lib/components/ui/card/index";
  import Badge from "./ui/badge/badge.svelte";
  export let appName: string;
  export let appId: string;
  export let status: boolean;
</script>

<a href="/app/{appId}" class="">
  <Card.Root
    class="min-w-full md:min-w-88 max-w-min h-30 md:h-40 bg-muted/40 border-muted hover:bg-accent hover:scale-105 active:scale-95 transition-all"
  >
    <Card.Header>
      <div class="flex items-center gap-2">
        <div class="text-xl font-bold">{appName}</div>
      </div>
    </Card.Header>
    <Card.Content>
      <div class="flex flex-col gap-2">
        <div class="text-sm">
          <Badge variant={status ? "default" : "destructive"}
            >{status ? "Active" : "Inactive"}</Badge
          >
        </div>
      </div>
    </Card.Content>
  </Card.Root>
</a>
