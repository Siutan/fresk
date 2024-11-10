<script lang="ts">
  import Loader from "$lib/components/loader.svelte";
  import CodeContextViewer from "$lib/components/code-context-viewer.svelte";
  import type { Log } from "$lib/types/Log";
  import { enhancedDecodeStacktrace } from "$lib/stacktraceHandler";
  export let currentError: Log;

  const getStacktrace = async (id: string) => {
    const trace = await enhancedDecodeStacktrace(
        //@ts-ignore <I know I typed this as a string, but it's a stackframe array>
      currentError.stacktrace,
      currentError.app_id
    );

    return trace;
  };
</script>

<div class="flex flex-col gap-4 w-full">
  <h3 class="text-sm font-bold">Stacktrace</h3>
  <div class="flex flex-col gap-2 w-full">
    {#await getStacktrace(currentError.id)}
      <div class="flex flex-col items-center justify-center gap-2">
        <Loader />
      </div>
    {:then stacktrace}
      <div class="flex flex-col gap-2">
        {#if stacktrace && stacktrace.codeContext}
          <div class="whitespace-pre-wrap">
            <CodeContextViewer
              codeContext={stacktrace.codeContext || []}
              fileName={stacktrace.decodedFileName || "unknown"}
            />
          </div>
        {:else}
          No stacktrace found
        {/if}
      </div>
    {/await}
  </div>
</div>
