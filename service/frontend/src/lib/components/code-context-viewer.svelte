<script lang="ts">
  export let codeContext: Array<{
    line: number;
    isHighlighted: boolean;
    text: string;
  }>;
  export let fileName: string;

  $: maxLineNumberWidth = Math.max(
    ...codeContext.map((line) => line.line.toString().length)
  );
</script>

<div class="font-mono text-sm bg-background rounded-md overflow-hidden">
  <div class="bg-secondary px-4 py-2 text-foreground font-base">
    {fileName}
  </div>
  <div class="relative">
    <code class="block px-4">
      {#each codeContext as line}
        <span class="flex h-5">
          <span
            class="w-{maxLineNumberWidth * 0.6 +
              1}rem inline-block text-muted-foreground text-right mr-4">{line.line}</span
          >
          <span class="{line.isHighlighted ? 'bg-orange-500/50 mx-10' : 'px-10'} flex-grow rounded-md">
            {line.text}
          </span>
        </span>
      {/each}
    </code>
    {#if codeContext.some((line) => line.isHighlighted)}
      <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div class="h-full w-full opacity-50"></div>
      </div>
    {/if}
  </div>
</div>
