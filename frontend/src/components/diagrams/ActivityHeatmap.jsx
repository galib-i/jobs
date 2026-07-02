import ReactECharts from "echarts-for-react";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  GetTimelineData,
  GetActivityStats,
} from "../../../bindings/jobs/jobservice";

function parseDate(str) {
  const [y, m, d] = str.split("-");
  return new Date(y, m - 1, d);
}

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;
}

export default function ActivityHeatmap() {
  const [timelineData, setTimelineData] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    GetTimelineData("day").then(setTimelineData).catch(console.error);
    GetActivityStats().then(setStats).catch(console.error);
  }, []);

  const option = useMemo(() => {
    if (
      !timelineData ||
      !timelineData.dates ||
      timelineData.dates.length === 0
    ) {
      return null;
    }

    const { dates, counts } = timelineData;

    const countMap = {};
    dates.forEach((date, i) => {
      countMap[date] = counts[i];
    });

    const firstDateStr = dates[0];
    const lastDateStr = dates[dates.length - 1];

    let currDate = parseDate(firstDateStr);
    const endDate = parseDate(lastDateStr);
    currDate.setDate(currDate.getDate() - currDate.getDay());
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const weeks = [];
    const heatmapData = [];

    let weekIndex = 0;
    while (currDate <= endDate) {
      const wDateStr = formatDate(currDate);
      weeks.push(wDateStr);

      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const dStr = formatDate(currDate);
        const count = countMap[dStr] || 0;
        heatmapData.push([weekIndex, dayIndex, count, dStr]);
        currDate.setDate(currDate.getDate() + 1);
      }
      weekIndex++;
    }

    const maxSpan = 26;
    const dataLen = weeks.length;
    const startPercent =
      dataLen > maxSpan ? 100 - (maxSpan / dataLen) * 100 : 0;

    const chart = {
      tooltip: {
        position: "top",
        appendToBody: true,
        padding: [4, 8],
        formatter: function (p) {
          const count = p.data[2];
          const date = p.data[3];
          const [y, m, d] = date.split("-");

          return `${count} activit${count === 1 ? "y" : "ies"} on ${d}-${m}`;
        },
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderColor: "#334155",
        textStyle: { color: "#f8fafc", fontSize: 12 },
      },
      visualMap: {
        dimension: 2,
        min: 0,
        max: Math.max(7, Math.max(...counts)),
        type: "piecewise",
        show: true,
        orient: "horizontal",
        right: -8,
        bottom: 15,
        itemWidth: 12,
        itemHeight: 12,
        itemSymbol: "roundRect",
        itemGap: 4,
        showLabel: false,
        text: ["More", "Less"],
        textGap: 6,
        textStyle: { color: "#94a3b8", fontSize: 11, fontWeight: "bold" },
        pieces: [
          { value: 0, color: "#1e293b" },
          { min: 1, max: 2, color: "#0e4429" },
          { min: 3, max: 4, color: "#006d32" },
          { min: 5, max: 6, color: "#26a641" },
          { min: 7, color: "#39d353" },
        ],
      },
      grid: {
        top: 0,
        right: 0,
        bottom: 50,
        left: 0,
      },
      xAxis: {
        show: true,
        type: "category",
        data: weeks,
        position: "top",
        splitArea: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: "#94a3b8",
          fontWeight: "bold",
          interval: 0,
          formatter: (value) => {
            const absIndex = weeks.indexOf(value);
            if (absIndex === 0) {
              return parseDate(value)
                .toLocaleDateString("en-US", {
                  month: "short",
                })
                .toUpperCase();
            }
            const curr = parseDate(value);
            const prev = parseDate(weeks[absIndex - 1]);
            if (curr.getMonth() !== prev.getMonth()) {
              return curr
                .toLocaleDateString("en-US", { month: "short" })
                .toUpperCase();
            }
            return "";
          },
        },
      },
      yAxis: {
        show: true,
        type: "category",
        data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        inverse: true, // Sun at top
        splitArea: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: "#94a3b8",
          fontWeight: "bold",
          formatter: (value) => {
            if (value === "Mon" || value === "Wed" || value === "Fri") {
              return value.toUpperCase();
            }
            return "";
          },
        },
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
          borderColor: "#1e293b", // slate-800
          backgroundColor: "#0f172a", // slate-900
          fillerColor: "#3b82f6", // blue-500
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
      series: [
        {
          type: "heatmap",
          data: heatmapData,
          itemStyle: {
            borderRadius: 4,
            borderColor: "#0f172a",
            borderWidth: 2,
          },
        },
      ],
    };

    return chart;
  }, [timelineData]);

  if (!option || !stats) {
    return null;
  }

  return (
    <div className="flex flex-col mx-auto w-[850px]">
      <div className="relative grid grid-cols-[200px_1fr] bg-slate-900 border-2 border-blue-500 rounded-2xl overflow-hidden contain-content">
        {/* Overall Header */}
        <div className="col-span-full bg-blue-600 border-blue-500 border-b-2 font-pixel font-bold text-white tracking-wider select-none">
          <div className="flex items-center px-4 py-3 pl-6 whitespace-nowrap">
            Application Activity
          </div>
        </div>

        {/* Left Column: Stats */}
        <div className="flex flex-col justify-between gap-4 p-6 border-slate-700 border-r">
          <div>
            <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-xs">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Current streak
            </div>
            <div className="font-pixel font-bold text-slate-100 text-base">
              {stats.currentStreak} day{stats.currentStreak !== 1 ? "s" : ""}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-xs">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7.5 4 8.5 7 8.5 7H12" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C16.5 4 15.5 7 15.5 7H12" />
                <path d="M12 9v10" />
                <path d="M8 14h8" />
              </svg>
              Longest streak
            </div>
            <div className="flex items-baseline font-pixel font-bold text-slate-100 text-base whitespace-nowrap">
              {stats.longestStreak} day{stats.longestStreak !== 1 ? "s" : ""}
              {stats.longestStreakMonth && (
                <div className="-top-[2px] relative ml-1.5 font-sans font-normal text-slate-500 text-xs">
                  · {stats.longestStreakMonth}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1 text-slate-400 text-xs">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Most active day
            </div>
            <div className="font-pixel font-bold text-slate-100 text-base">
              {stats.mostActiveDay}
            </div>
          </div>
        </div>

        {/* Right Column: Heatmap */}
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
