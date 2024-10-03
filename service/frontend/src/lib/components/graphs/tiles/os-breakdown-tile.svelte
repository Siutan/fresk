<script lang="ts">
  export let data: { os: string; count: number }[];

  const total = data.reduce((sum, item) => sum + item.count, 0);

  // Calculate percentages
  const percentageData = data.map((item) => ({
    ...item,
    percentage: ((item.count / total) * 100).toFixed(1),
  }));

  // Get top 4 browsers
  const topSystems = percentageData.slice(0, 4);
  const otherCount = percentageData
    .slice(4)
    .reduce((sum, item) => sum + item.count, 0);
  if (otherCount > 0) {
    topSystems.push({
      os: "Other",
      count: otherCount,
      percentage: ((otherCount / total) * 100).toFixed(1),
    });
  }
</script>

<div class="min-h-max max-h-72 flex flex-col gap-4">
  <h3 class="text-sm font-bold">Operating Systems</h3>
  <div class="flex flex-col gap-2 overflow-hidden">
    {#each topSystems as item}
      <div class="group">
        <div class="flex items-center justify-between gap-2">
          <p>{item.os}</p>
          <p class="text-sm text-muted-foreground">
            {item.percentage}% ({item.count})
          </p>
        </div>
        <div
          class="flex items-center justify-start 300 ease-in-out h-2 bg-muted w-full rounded-md"
        >
          <div
            class="flex items-center justify-center transition-all duration-300 ease-in-out h-full bg-muted-foreground group-hover:bg-primary rounded-md"
            style="width: {item.percentage}%"
          ></div>
        </div>
      </div>
    {/each}
  </div>
</div>
