<script lang="ts">
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

  export let data: { hour: string; errors: any[] }[];

  const formattedData = data.map(({ hour, errors }) => ({
    date: hour,
    value: errors.length,
  }));
</script>

<div class="h-96 px-4">
  <Chart
    data={formattedData}
    x="value"
    yScale={scaleBand().padding(0.4)}
    y="date"
    xDomain={[0, null]}
    xNice={4}
    padding={{ left: 20, bottom: 20 }}
    tooltip={{ mode: "band" }}
  >
    <Svg>
      <Axis
        placement="left"
        format={(d) => {
          // only show labels in 6 hour intervals
          if (d === "12 AM" || d === "6 AM" || d === "6 PM") {
            return d;
          } else if (d === "0 PM") {
            return "12 PM";
          }
          return "";
        }}
        rule
        tickLabelProps={{
          class: "fill-primary text-xs font-semibold pr-2",
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
            <Bars
              radius={4}
              strokeWidth={1}
              class="fill-primary stroke-primary"
            />
          </RectClipPath>
        </svelte:fragment>
      </Highlight>
    </Svg>
    <Tooltip.Root let:data>
      <Tooltip.Header>{data.date}</Tooltip.Header>
      <Tooltip.List>
        <Tooltip.Item label="value" value={data.value} />
      </Tooltip.List>
    </Tooltip.Root>
  </Chart>
</div>
