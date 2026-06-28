import SankeyDiagram from "../components/diagrams/SankeyDiagram";
import TimeDiagram from "../components/diagrams/TimeDiagram";

export default function DiagramsPage() {
  return (
    <div className="flex flex-col gap-8">
      <TimeDiagram />
      <SankeyDiagram />
    </div>
  );
}
