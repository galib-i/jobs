import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { GetTimelineData } from "../../../bindings/jobs/jobservice";
import { Button } from "../ui/Button";

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
    day: 7,
    week: 26,
    month: 6,
  };
  const maxSpan = maxSpans[groupBy];
  const dataLen = timelineData.dates.length;
  const startPercent = dataLen > maxSpan ? 100 - (maxSpan / dataLen) * 100 : 0;

  const option = {
    tooltip: {
      show: true,
      appendToBody: true,
      padding: [4, 8],
      backgroundColor: "rgba(15, 23, 42, 0.9)",
      borderColor: "#334155",
      textStyle: { color: "#f8fafc", fontSize: 12 },
    },
    grid: {
      top: 10,
      right: 15,
      bottom: 45,
      left: 40,
    },
    dataZoom: [
      {
        type: "slider",
        show: true,
        xAxisIndex: [0],
        start: startPercent,
        end: 100,
        maxValueSpan: maxSpan,
        bottom: 0,
        height: 8,
        showDataShadow: false,
        showDetail: false,
        borderColor: "#1e293b",
        backgroundColor: "#0f172a",
        fillerColor: "#3b82f6",
        handleSize: 0,
        brushSelect: false,
      },
      {
        type: "inside",
        xAxisIndex: [0],
        zoomOnMouseWheel: false,
        moveOnMouseWheel: true,
        moveOnMouseMove: true,
      },
    ],
    xAxis: {
      type: "category",
      boundaryGap: true,
      data: timelineData.dates,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: "#94a3b8",
        fontWeight: "bold",
        formatter: (val) => {
          const parts = val.split("-");
          if (parts.length === 3) {
            const date = new Date(parts[0], parts[1] - 1, parts[2]);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          } else if (parts.length === 2) {
            const date = new Date(parts[0], parts[1] - 1);
            return date.toLocaleDateString("en-US", { month: "short" });
          }
          return val;
        },
      },
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      splitLine: {
        lineStyle: { color: "#334155" },
      },
      axisLabel: {
        color: "#94a3b8",
        fontWeight: "bold",
      },
    },
    series: [
      {
        data: timelineData.counts,
        type: "bar",
        cursor: "default",
        itemStyle: {
          color: "#eab308",
          borderRadius: [4, 4, 0, 0],
        },
        emphasis: {
          disabled: true,
        },
        barWidth: "80%",
      },
    ],
  };

  return (
    <div className="flex flex-col w-[850px] xl:w-[425px] shrink-0">
      <div className="relative bg-slate-900 border-2 border-blue-500 rounded-2xl overflow-hidden contain-content">
        {/* Overall Header */}
        <div className="flex justify-between items-center bg-blue-600 border-blue-500 border-b-2 font-pixel font-bold text-white tracking-wider select-none">
          <div className="px-4 py-3 pl-6 whitespace-nowrap">Volume</div>
          <div className="flex items-center pr-4 select-none">
            {["day", "week", "month"].map((group, index) => {
              const position =
                index === 0 ? "left" : index === 1 ? "middle" : "right";
              return (
                <Button
                  key={group}
                  position={position}
                  theme="yellow"
                  size="sm"
                  isActive={groupBy === group}
                  onClick={() => setGroupBy(group)}
                >
                  {group.toUpperCase()}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Chart Container */}
        <div className="flex justify-center items-center p-4 pt-6 min-w-0">
          <ReactECharts
            option={option}
            style={{ height: 200, width: "100%", margin: "0 auto" }}
            opts={{ renderer: "svg" }}
            notMerge
          />
        </div>
      </div>
    </div>
  );
}
