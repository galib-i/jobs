import SankeyDiagram from "../components/diagrams/SankeyDiagram";
import TimeDiagram from "../components/diagrams/TimeDiagram";
import ActivityHeatmap from "../components/diagrams/ActivityHeatmap";

export default function DiagramsPage() {
  return (
    <div className="flex flex-col gap-10">
      <ActivityHeatmap />
      <div className="gap-10 grid grid-cols-1 xl:grid-cols-2">
        <TimeDiagram />
      </div>
      <SankeyDiagram />
    </div>
  );
}
