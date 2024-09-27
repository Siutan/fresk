<script lang="ts">
  import { page } from "$app/stores";
</script>

<div class="flex flex-col items-center justify-center gap-4 w-full">
  <h2 class="text-2xl">Error</h2>
  {#if $page.error}
    <h1>{$page.error.message}</h1>
  {/if}
</div>
