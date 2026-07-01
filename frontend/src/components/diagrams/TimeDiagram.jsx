import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { GetTimelineData } from "../../../bindings/jobs/jobservice";

export default function TimelineDiagram() {
  const [groupBy, setGroupBy] = useState("day");
  const [timelineData, setTimelineData] = useState(null);

  useEffect(() => {
    GetTimelineData(groupBy + "_apps")
      .then(setTimelineData)
      .catch(console.error);
  }, [groupBy]);

  if (!timelineData || !timelineData.dates || timelineData.dates.length === 0) {
    return null;
  }

  const maxSpans = {
    day: 180,
    week: 26,
    month: 6,
  };
  const maxSpan = maxSpans[groupBy];
  const dataLen = timelineData.dates.length;
  const startPercent = dataLen > maxSpan ? 100 - (maxSpan / dataLen) * 100 : 0;

  const option = {
    tooltip: { show: false },
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: [0],
        start: startPercent,
        end: 100,
        maxValueSpan: maxSpan,
        bottom: 25,
        height: 6,
        showDataShadow: false,
        showDetail: false,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        fillerColor: "rgba(255, 0, 0, 0.6)",
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
    <div className="flex flex-col">
      <div className="flex justify-end items-center mb-4">
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
      <div className="bg-slate-900 p-6 pb-4 rounded-xl">
        <ReactECharts
          option={option}
          style={{ height: 260, width: "100%", margin: "0 auto" }}
          opts={{ renderer: "svg" }}
          notMerge
        />
      </div>
    </div>
  );
}
