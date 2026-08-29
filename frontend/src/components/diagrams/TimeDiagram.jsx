import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { GetTimelineData } from "../../../bindings/jobs/jobservice";
import { Button } from "../ui/Button";

export default function TimelineDiagram({ theme }) {
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

  const isDark = theme === "dark";

  const option = {
    tooltip: {
      show: true,
      appendToBody: true,
      padding: [4, 8],
      backgroundColor: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
      borderColor: isDark ? "#334155" : "#cbd5e1",
      textStyle: { color: isDark ? "#f8fafc" : "#1e293b", fontSize: 12 },
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
        borderColor: isDark ? "#1e293b" : "#e2e8f0",
        backgroundColor: isDark ? "#0f172a" : "#f1f5f9",
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
        color: isDark ? "#94a3b8" : "#64748b",
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
        lineStyle: { color: isDark ? "#334155" : "#e2e8f0" },
      },
      axisLabel: {
        color: isDark ? "#94a3b8" : "#64748b",
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
    <div className="flex w-212.5 shrink-0 flex-col xl:w-106.25">
      <div className="relative overflow-hidden rounded-2xl border-2 border-blue-500 bg-slate-100 contain-content dark:bg-slate-900">
        {/* Overall Header */}
        <div className="font-pixel flex items-center justify-between border-b-2 border-blue-500 bg-blue-600 font-bold tracking-wider text-white select-none">
          <div className="px-4 py-3 pl-6 whitespace-nowrap">Volume</div>
          <div className="flex items-center pr-4 select-none">
            {["day", "week", "month"].map((group, index) => {
              const position = index === 0 ? "left" : index === 1 ? "middle" : "right";
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
        <div className="flex min-w-0 items-center justify-center p-4 pt-6">
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
