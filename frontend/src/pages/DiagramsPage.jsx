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
      <div className="flex justify-center items-center mt-32 font-pixel text-slate-500 dark:text-slate-400 text-sm animate-pulse">
        LOADING STATISTICS...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex xl:flex-row flex-col justify-center items-center xl:items-start gap-6 w-full">
        <ActivityHeatmap theme={theme} />
        <TimeDiagram theme={theme} />
      </div>
      <SankeyDiagram theme={theme} />
    </div>
  );
}
