<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import { scaleBand } from "d3-scale";

  import {
    Axis,
    Bars,
    Chart,
    Highlight,
    RectClipPath,
    Svg,
    Tooltip,
  } from "layerchart";

  import { format, PeriodType } from "@layerstack/utils";

  export let data;

  const formattedData = Object.entries(data).map(([date, value]) => ({
    date,
    value,
  })).reverse();
</script>

<Card.Root class="w-full bg-muted/40 border-muted">
  <Card.Header>
    <Card.Title>Logs per Day</Card.Title>
  </Card.Header>
  <Card.Content class="h-[10rem]">
    <Chart
      data={formattedData}
      x="date"
      xScale={scaleBand().padding(0.4)}
      y="value"
      yDomain={[0, null]}
      yNice={4}
      padding={{ left: 16, bottom: 24 }}
      tooltip={{ mode: "band" }}
    >
      <Svg>
        <Axis
          placement="left"
          grid
          rule
          tickLabelProps={{
            textAnchor: "end",
            class: "fill-primary text-sm font-semibold",
          }}
        />
        <Axis
          placement="bottom"
          format={(d) => format(d, PeriodType.Day, { variant: "short" })}
          rule
          tickLabelProps={{
            class: "fill-primary text-sm font-semibold pt-2",
          }}
        />
        <Bars
          radius={4}
          strokeWidth={1}
          class="fill-secondary stroke-secondary group-hover:fill-gray-300 transition-colors"
        />
        <Highlight area>
          <svelte:fragment slot="area" let:area>
            <RectClipPath
              x={area.x}
              y={area.y}
              width={area.width}
              height={area.height}
              spring
            >
              <Bars radius={4} strokeWidth={1} class="fill-primary stroke-primary" />
            </RectClipPath>
          </svelte:fragment>
        </Highlight>
      </Svg>
      <Tooltip.Root let:data>
        <Tooltip.Header
          >{format(data.date, PeriodType.Custom, {
            custom: "eee, MMMM do",
          })}</Tooltip.Header
        >
        <Tooltip.List>
          <Tooltip.Item label="value" value={data.value} />
        </Tooltip.List>
      </Tooltip.Root>
    </Chart>
  </Card.Content>
  <Card.Footer>
    <div class="flex gap-2">
      <div class="text-muted-foreground">Last 30 days</div>
    </div>
  </Card.Footer>
</Card.Root>
