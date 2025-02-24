<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";

</script>

<div class="flex flex-1 w-full min-h-dvh">

  <form method="post" action="?/logout">
    <Button variant="destructive" type="submit">Logout</Button>
  </form>
</div>
