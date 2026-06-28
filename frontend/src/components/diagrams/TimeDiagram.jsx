import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { GetTimelineData } from "../../../bindings/jobs/jobservice";

export default function TimelineDiagram() {
  const [groupBy, setGroupBy] = useState("day");
  const [timelineData, setTimelineData] = useState(null);

  useEffect(() => {
    GetTimelineData(groupBy).then(setTimelineData).catch(console.error);
  }, [groupBy]);

  if (!timelineData || !timelineData.dates || timelineData.dates.length === 0) {
    return null;
  }

  const option = {
    tooltip: { show: false },
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: [0],
        start: 50,
        end: 100,
        bottom: 25,
        height: 6,
        showDataShadow: false,
        showDetail: false,
        borderColor: "transparent",
        backgroundColor: "transparent",
        fillerColor: "rgba(0, 0, 0, 0.2)",
        handleSize: 0,
        brushSelect: false,
      },
    ],
    xAxis: {
      type: "category",
      boundaryGap: true,
      data: timelineData.dates,
      axisLabel: {
        color: "#94a3b8",
      },
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      axisLabel: {
        color: "#94a3b8",
      },
    },
    series: [
      {
        data: timelineData.counts,
        type: "bar",
        cursor: "default",
        itemStyle: {
          color: "#4CAF50",
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          disabled: true,
        },
        barWidth: "90%",
      },
    ],
  };

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-pixel font-bold text-slate-200 text-xl tracking-wider">
          Activity
        </h2>
        <div className="flex space-x-2 text-sm">
          {["day", "week", "month"].map((group) => (
            <button
              key={group}
              onClick={() => setGroupBy(group)}
              className={`px-3 py-1 rounded border transition-colors ${
                groupBy === group
                  ? "bg-green-500 text-white border-green-500 font-bold"
                  : "bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700"
              }`}
            >
              Per {group.charAt(0).toUpperCase() + group.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <ReactECharts
        option={option}
        style={{ height: 300, width: "100%", margin: "0 auto" }}
        opts={{ renderer: "svg" }}
        notMerge
      />
    </div>
  );
}
