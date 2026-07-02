import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  GetSankeyData,
  ExportSankeyImage,
} from "../../../bindings/jobs/jobservice";
import { Button } from "../ui/Button";
import { DownloadIcon } from "../ui/Icon";
import SuccessPopup from "../ui/SuccessPopup";

export default function SankeyDiagram() {
  const [sankeyData, setSankeyData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [savedPath, setSavedPath] = useState("");
  const chartRef = useRef(null);

  const handleExport = () => {
    if (!option) return;

    // Load an invisible full-width container to always save the large version
    const tempDiv = document.createElement("div");
    tempDiv.style.width = "1299px";
    tempDiv.style.height =
      Math.max(300, option.series[0].data.length * 20) + "px";
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    document.body.appendChild(tempDiv);

    const tempInstance = echarts.init(tempDiv, null, { renderer: "canvas" });
    tempInstance.setOption({ ...option, animation: false });

    const base64Data = tempInstance.getDataURL({
      type: "png",
      pixelRatio: 2,
      backgroundColor: "#0f172a",
    });

    // Clean up
    tempInstance.dispose();
    document.body.removeChild(tempDiv);

    ExportSankeyImage(base64Data)
      .then((path) => {
        setSavedPath(path);
        setShowSuccess(true);
      })
      .catch(console.error);
  };

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
          nodeGap: 16,
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
    <>
      <div className="flex flex-col mx-auto w-212.5 xl:w-324.75 shrink-0">
        <div className="relative bg-slate-900 border-2 border-blue-500 rounded-2xl overflow-hidden contain-content">
          {/* Overall Header */}
          <div className="flex justify-between items-center bg-blue-600 border-blue-500 border-b-2 font-pixel font-bold text-white tracking-wider select-none">
            <div className="px-4 py-3 pl-6 whitespace-nowrap">Progress</div>
            <div className="flex items-center pr-4">
              <Button theme="green" isIcon size="sm" onClick={handleExport}>
                <DownloadIcon />
              </Button>
            </div>
          </div>

          {/* Chart Container */}
          <div className="flex justify-center items-center p-4 pt-6 min-w-0">
            <ReactECharts
              ref={chartRef}
              option={option}
              style={{
                height: Math.max(300, option.series[0].data.length * 20),
                width: "100%",
              }}
              notMerge
            />
          </div>
        </div>
      </div>
      <SuccessPopup
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Diagram Saved!"
        message={savedPath}
      />
    </>
  );
}
