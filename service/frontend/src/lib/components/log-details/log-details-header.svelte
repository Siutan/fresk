<script lang="ts">
  import Button from "../ui/button/button.svelte";
  import { createEventDispatcher } from "svelte";
  import {
    ChevronFirst,
    ChevronLast,
    ChevronLeft,
    ChevronRight,
  } from "lucide-svelte";
  import type { Log } from "$lib/types/Log";

  export let currentError: Log;
  export let currentLogIndex: number;
  export let totalErrors: number;

  const dispatch = createEventDispatcher();
</script>

<div class="flex items-center justify-between gap-4">
  <h2 class="text-xl font-bold">
    Log Id: {currentError.id}
  </h2>

  <div class="flex gap-2">
    <Button
      size="icon"
      on:click={() => dispatch("click", "first")}
      disabled={currentLogIndex === 0}
    >
      <ChevronFirst />
    </Button>
    <Button
      size="icon"
      on:click={() => dispatch("click", "previous")}
      disabled={currentLogIndex === 0}
    >
      <ChevronLeft />
    </Button>
    <Button
      size="icon"
      on:click={() => dispatch("click", "next")}
      disabled={currentLogIndex === totalErrors - 1}
    >
      <ChevronRight />
    </Button>
    <Button
      size="icon"
      on:click={() => dispatch("click", "last")}
      disabled={currentLogIndex === totalErrors - 1}
    >
      <ChevronLast />
    </Button>
  </div>
</div>
