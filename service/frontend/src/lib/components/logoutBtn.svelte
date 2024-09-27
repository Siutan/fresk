<script lang="ts">
  import { LogOut } from "lucide-svelte";
  import Button from "./ui/button/button.svelte";
  export let isCollapsed: boolean;
</script>

<form action="/auth/logout" method="POST" class="w-full mt-auto">
  <Button type="submit" variant="destructive" class="w-full gap-2" size="icon">
    <LogOut class="h-4 w-4" />
    {#if !isCollapsed}
      <span>Logout</span>
    {/if}
  </Button>
</form>
