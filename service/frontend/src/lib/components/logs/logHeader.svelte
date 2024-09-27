<script lang="ts">
  import Badge from "$lib/components/ui/badge/badge.svelte";

  export let id: string;
  export let appId: string;
  export let appName: string;
  export let appVersion: string;
  export let appEnvironment: string;
  export let logType: string;
  export let time: number;

  function formatDate(date: number) {
    const dateObject = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return dateObject.toLocaleString("en-US", options);
  }
</script>

<div class="flex justify-between gap-4 w-full p-5">
  <div class="flex flex-col items-start gap-2">
    <h3 class="text-lg font-semibold capitalize text-rose-500">{logType}</h3>
    <div class="text-sm text-muted-foreground">
      {formatDate(time)}
    </div>
  </div>
  <div class="flex flex-col items-end gap-2">
    <div class="flex items-center gap-2">
      <h3 class="text-lg font-base capitalize text-nowrap">
        {appName}
        <span class="text-sm text-muted-foreground">(v{appVersion})</span>
      </h3>
    </div>
    <div class="text-sm text-muted-foreground">
      Log ID: {id}
    </div>
    <Badge variant="secondary">{appEnvironment}</Badge>
  </div>
</div>
