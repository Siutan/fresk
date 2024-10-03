<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { ChevronLeft } from "lucide-svelte";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    import Loader from "$lib/components/loader.svelte";
  import { enhancedDecodeStacktrace } from "$lib/stacktraceHandler";

    export let group: any;
    export let error

    const getSearchQuery = async () => {
    if (!group) return "";
    if (!error) {
      return `${group.group_log_type}+${group.group_log_value}`;
    }
    const stacktrace = await enhancedDecodeStacktrace(
      error.stacktrace,
      error.build
    );

    console.log(stacktrace);
    // get the line where isHighlighted is true
    if (!stacktrace.codeContext)
      return `${group.group_log_type}+${group.group_log_value}`;

    const highlightedLine = stacktrace.codeContext.find(
      (line) => line.isHighlighted
    );
    const highlightedLineContent = highlightedLine?.text;

    return `${group.group_log_type}+${group.group_log_value}+${highlightedLineContent}`;
  };


</script>
<Card.Root class="w-full bg-muted/40 border-muted gap-4">
    <Card.Header>
      <div class="flex justify-between items-center">
        <a
          href={`/app/${group.group_app}`}
          class="flex items-center text-sky-600 hover:underline text-sm"
        >
          <ChevronLeft />
          back to app
        </a>
        <div class="flex flex-col items-end">
          <div class="text-xl font-bold text-rose-500">
            {group.group_log_type}
          </div>
          <div class="text-sm">{group.group_log_value}</div>
        </div>
      </div>
    </Card.Header>
    <Card.Content>
      <div class="flex flex-col gap-2">
        <Separator />
        <div class="w-full h-10 flex gap-4 items-center justify-between">
          {#await getSearchQuery()}
            <Loader />
          {:then query}
            <div class="flex flex-col text-sm">
              <p>Search on Google:</p>
              <p>
                <a
                  href={`https://www.google.com/search?q=${query}`}
                  target="_blank"
                  class="text-sky-600 hover:underline text-sm"
                >
                  {group.group_log_type}+{group.group_log_value}
                </a>
              </p>
            </div>
          {/await}
        </div>
      </div>
    </Card.Content>
  </Card.Root>