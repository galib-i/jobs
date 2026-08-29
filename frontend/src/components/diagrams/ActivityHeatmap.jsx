import ReactECharts from "echarts-for-react";
import { useEffect, useState, useMemo } from "react";
import { GetTimelineData, GetActivityStats } from "../../../bindings/jobs/jobservice";
import { ClockIcon, FlameIcon, CalendarIcon } from "../ui/Icon";

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

export default function ActivityHeatmap({ theme }) {
  const [timelineData, setTimelineData] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    GetTimelineData("day").then(setTimelineData).catch(console.error);
    GetActivityStats().then(setStats).catch(console.error);
  }, []);

  const option = useMemo(() => {
    if (!timelineData || !timelineData.dates || timelineData.dates.length === 0) {
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
    const startPercent = dataLen > maxSpan ? 100 - (maxSpan / dataLen) * 100 : 0;

    const chart = {
      tooltip: {
        position: "top",
        appendToBody: true,
        padding: [4, 8],
        formatter: function (p) {
          const count = p.data[2];
          const date = p.data[3];
          const [_y, m, d] = date.split("-");

          return `${count} activit${count === 1 ? "y" : "ies"} on ${d}-${m}`;
        },
        backgroundColor: theme === "dark" ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
        borderColor: theme === "dark" ? "#334155" : "#cbd5e1",
        textStyle: {
          color: theme === "dark" ? "#f8fafc" : "#1e293b",
          fontSize: 12,
        },
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
        textStyle: {
          color: theme === "dark" ? "#94a3b8" : "#64748b",
          fontSize: 11,
          fontWeight: "bold",
        },
        pieces: [
          { value: 0, color: theme === "dark" ? "#1e293b" : "#e2e8f0" },
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
          color: theme === "dark" ? "#94a3b8" : "#64748b",
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
              return curr.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
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
          color: theme === "dark" ? "#94a3b8" : "#64748b",
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
          borderColor: theme === "dark" ? "#1e293b" : "#e2e8f0",
          backgroundColor: theme === "dark" ? "#0f172a" : "#f1f5f9",
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
      series: [
        {
          type: "heatmap",
          data: heatmapData,
          itemStyle: {
            borderRadius: 4,
            borderColor: theme === "dark" ? "#0f172a" : "#f1f5f9",
            borderWidth: 2,
          },
        },
      ],
    };

    return chart;
  }, [timelineData, theme]);

  if (!option || !stats) {
    return null;
  }

  return (
    <div className="flex w-212.5 shrink-0 flex-col">
      <div className="relative grid grid-cols-[200px_1fr] overflow-hidden rounded-2xl border-2 border-blue-500 bg-slate-100 contain-content dark:bg-slate-900">
        {/* Overall Header */}
        <div className="font-pixel col-span-full border-b-2 border-blue-500 bg-blue-600 font-bold tracking-wider text-white select-none">
          <div className="flex items-center px-4 py-3 pl-6 whitespace-nowrap">Activity</div>
        </div>

        {/* Left Column: Stats */}
        <div className="flex flex-col justify-between gap-4 border-r border-slate-300 p-6 dark:border-slate-700">
          <div>
            <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <ClockIcon />
              Current streak
            </div>
            <div className="font-pixel text-base font-bold text-slate-800 dark:text-slate-100">
              {stats.currentStreak} day{stats.currentStreak !== 1 ? "s" : ""}
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <FlameIcon />
              Longest streak
            </div>
            <div className="flex items-baseline text-base font-bold whitespace-nowrap text-slate-800 dark:text-slate-100">
              <span className="font-pixel">
                {stats.longestStreak} day{stats.longestStreak !== 1 ? "s" : ""}
              </span>
              {stats.longestStreakMonth && (
                <div className="relative -top-0.5 ml-1.5 text-xs font-normal text-slate-500">
                  · {stats.longestStreakMonth}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <CalendarIcon />
              Most active day
            </div>
            <div className="font-pixel text-base font-bold text-slate-800 dark:text-slate-100">
              {stats.mostActiveDay}
            </div>
          </div>
        </div>

        {/* Right Column: Heatmap */}
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
