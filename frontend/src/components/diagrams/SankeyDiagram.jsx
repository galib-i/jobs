import ReactECharts from "echarts-for-react";
import { useEffect, useState, useMemo } from "react";
import { GetSankeyData } from "../../../bindings/jobs/jobservice";

export default function SankeyDiagram() {
  const [sankeyData, setSankeyData] = useState(null);

  useEffect(() => {
    GetSankeyData().then(setSankeyData).catch(console.error);
  }, []);

  const option = useMemo(() => {
    if (!sankeyData || !sankeyData.nodes || sankeyData.nodes.length === 0) {
      return null;
    }

    const nodes = sankeyData.nodes.map((node) => {
      const blockStyle = {
        backgroundColor: node.colour,
        color: node.textColour,
        padding: [4, 8],
        borderRadius: 4,
        fontWeight: "bold",
      };

      return {
        name: node.name,
        cleanName: node.cleanName,
        itemStyle: { color: node.colour },
        label: {
          rich: {
            nameBlock: blockStyle,
            valBlock: blockStyle,
          },
        },
      };
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
          links: sankeyData.links,
          lineStyle: { color: "source", opacity: 0.4, curveness: 0.5 },
          label: {
            position: "right",
            textBorderWidth: 0,
            formatter: ({ data, value }) =>
              `{nameBlock|${data.cleanName}} {valBlock|${value}}`,
          },
        },
      ],
    };
  }, [sankeyData]);

  if (!option) return <p>No data</p>;

  return (
    <ReactECharts
      option={option}
      style={{
        height: Math.max(200, option.series[0].data.length * 25),
        width: "100%",
      }}
      opts={{ renderer: "svg" }}
      notMerge
    />
  );
}
