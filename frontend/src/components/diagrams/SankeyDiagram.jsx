import ReactECharts from "echarts-for-react";
import { useMemo } from "react";
import { getStageColour, getStageTextColour } from "../../colours";

function buildSankeyOption(jobs) {
  if (!jobs?.length) return null;

  const nodeSet = new Set();
  const linkMap = new Map();

  for (const { stages } of jobs) {
    if (!stages?.length) continue;

    stages.forEach((stage, i) => {
      const current = `${stage}__${i}`;
      nodeSet.add(current);

      if (i < stages.length - 1) {
        const next = `${stages[i + 1]}__${i + 1}`;
        const linkKey = `${current}|||${next}`;
        linkMap.set(linkKey, (linkMap.get(linkKey) || 0) + 1);
      }
    });
  }

  if (nodeSet.size === 0) return null;

  const nodes = Array.from(nodeSet).map((name) => {
    const cleanName = name.split("__")[0];
    const bgColour = getStageColour(cleanName);
    const textColour = getStageTextColour(bgColour);

    const blockStyle = {
      backgroundColor: bgColour,
      color: textColour,
      padding: [4, 8],
      borderRadius: 4,
      fontWeight: "bold",
    };

    return {
      name,
      itemStyle: { color: bgColour },
      label: {
        rich: {
          nameBlock: blockStyle,
          valBlock: blockStyle,
        },
      },
    };
  });

  const links = Array.from(linkMap, ([key, value]) => {
    const [source, target] = key.split("|||");
    return { source, target, value };
  });

  return {
    tooltip: { show: false },
    series: [
      {
        type: "sankey",
        layoutIterations: 32,
        silent: true,
        nodeAlign: "left",
        nodeGap: 24,
        data: nodes,
        links,
        lineStyle: { color: "source", opacity: 0.4, curveness: 0.5 },
        label: {
          position: "right",
          textBorderWidth: 0,
          formatter: ({ name, value }) =>
            `{nameBlock|${name.split("__")[0]}} {valBlock|${value}}`,
        },
      },
    ],
  };
}

export default function SankeyDiagram({ jobs }) {
  const option = useMemo(() => buildSankeyOption(jobs), [jobs]);

  if (!option) return <p>No data</p>;

  return (
    <ReactECharts
      option={option}
      style={{
        height: Math.max(400, option.series[0].data.length * 50),
        width: "100%",
      }}
      opts={{ renderer: "svg" }}
      notMerge
    />
  );
}
