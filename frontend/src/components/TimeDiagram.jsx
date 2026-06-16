import ReactECharts from "echarts-for-react";
import { useMemo, useState } from "react";

function buildTimelineOption(jobs, groupBy) {
  if (!jobs?.length) return null;

  const countsByDate = jobs.reduce((acc, job) => {
    if (!job.createdAt) return acc;

    let key = job.createdAt;
    if (groupBy === "month") {
      key = key.substring(0, 7);
    } else if (groupBy === "week") {
      const d = new Date(key);
      d.setUTCDate(d.getUTCDate() - (d.getUTCDay() || 7) + 1);
      key = d.toISOString().split("T")[0];
    }

    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const sortedDates = Object.keys(countsByDate).sort();
  if (sortedDates.length === 0) return null;

  const data = sortedDates.map((date) => countsByDate[date]);

  return {
    tooltip: {
      show: false,
    },
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
      data: sortedDates,
      axisLabel: {
        color: "#6b7280",
      },
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      axisLabel: {
        color: "#6b7280",
      },
    },
    series: [
      {
        data: data,
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
}

export default function TimelineDiagram({ jobs }) {
  const [groupBy, setGroupBy] = useState("day");

  const option = useMemo(
    () => buildTimelineOption(jobs, groupBy),
    [jobs, groupBy],
  );

  if (!option) return null;

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2 text-sm">
          {["day", "week", "month"].map((group) => (
            <button
              key={group}
              onClick={() => setGroupBy(group)}
              className={`px-3 py-1 rounded border transition-colors ${
                groupBy === group
                  ? "bg-green-500 text-white border-green-500 font-bold"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
            >
              Per {group.charAt(0).toUpperCase() + group.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <ReactECharts
        option={option}
        style={{ height: 300, width: "50%", margin: "0 auto" }}
        opts={{ renderer: "svg" }}
        notMerge
      />
    </div>
  );
}
