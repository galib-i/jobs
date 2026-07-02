import SankeyDiagram from "../components/diagrams/SankeyDiagram";
import TimeDiagram from "../components/diagrams/TimeDiagram";
import ActivityHeatmap from "../components/diagrams/ActivityHeatmap";

export default function DiagramsPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex xl:flex-row flex-col justify-center items-center xl:items-start gap-6 w-full">
        <ActivityHeatmap />
        <TimeDiagram />
      </div>
      <SankeyDiagram />
    </div>
  );
}
