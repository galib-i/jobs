import ReactECharts from "echarts-for-react";
import { useEffect, useState, useMemo } from "react";
import { GetTimelineData } from "../../../bindings/jobs/jobservice";

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

  useEffect(() => {
    GetTimelineData("day").then(setTimelineData).catch(console.error);
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

    return {
      tooltip: {
        position: "top",
        formatter: function (p) {
          const count = p.data[2];
          const date = p.data[3];
          const [y, m, d] = date.split("-");
          return `${count} activit${count === 1 ? "y" : "ies"} on ${d}-${m}`;
        },
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderColor: "#334155",
        textStyle: { color: "#f8fafc" },
      },
      visualMap: {
        dimension: 2,
        min: 0,
        max: Math.max(7, Math.max(...counts)),
        type: "piecewise",
        show: false,
        pieces: [
          { min: 7, color: "#39d353" },
          { min: 5, max: 6, color: "#26a641" },
          { min: 3, max: 4, color: "#006d32" },
          { min: 1, max: 2, color: "#0e4429" },
          { value: 0, color: "#1e293b" },
        ],
      },
      grid: {
        top: 30,
        right: 20,
        bottom: 30,
        left: 40,
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
          interval: 0,
          formatter: (value) => {
            const absIndex = weeks.indexOf(value);
            if (absIndex === 0) {
              return parseDate(value).toLocaleDateString("en-US", {
                month: "short",
              });
            }
            const curr = parseDate(value);
            const prev = parseDate(weeks[absIndex - 1]);
            if (curr.getMonth() !== prev.getMonth()) {
              return curr.toLocaleDateString("en-US", { month: "short" });
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
          formatter: (value) => {
            if (value === "Mon" || value === "Wed" || value === "Fri") {
              return value;
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
      series: [
        {
          type: "heatmap",
          data: heatmapData,
          itemStyle: {
            borderRadius: 8,
            borderColor: "#0f172a",
            borderWidth: 2,
          },
        },
      ],
    };
  }, [timelineData]);

  if (!option) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="bg-slate-900 mt-auto border-2 border-slate-700 rounded-xl">
        <ReactECharts
          option={option}
          style={{ height: 211, width: "81%", margin: "0 auto" }}
          opts={{ renderer: "svg" }}
          notMerge
        />
      </div>
    </div>
  );
}
