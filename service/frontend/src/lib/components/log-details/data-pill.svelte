<script lang="ts">
  export let heading: string;
  export let content: string;
</script>

<div
  class="flex gap-2 w-fit px-4 py-2 rounded-md bg-muted group hover:bg-primary/40 duration-300"
>
  <h3 class="text-sm font-bold">{heading}</h3>
  <p
    class="text-sm capitalize text-muted-foreground group-hover:text-secondary-foreground duration-300"
  >
    {content}
  </p>
</div>
