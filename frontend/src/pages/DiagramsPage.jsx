import SankeyDiagram from "../components/diagrams/SankeyDiagram";
import TimeDiagram from "../components/diagrams/TimeDiagram";
import ActivityHeatmap from "../components/diagrams/ActivityHeatmap";
import { useState, useEffect } from "react";

export default function DiagramsPage({ theme }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Add a short loading delay
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="font-pixel mt-32 flex animate-pulse items-center justify-center text-sm text-slate-500 dark:text-slate-400">
        LOADING STATISTICS...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full flex-col items-center justify-center gap-6 xl:flex-row xl:items-start">
        <ActivityHeatmap theme={theme} />
        <TimeDiagram theme={theme} />
      </div>
      <SankeyDiagram theme={theme} />
    </div>
  );
}
