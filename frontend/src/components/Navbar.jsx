export default function Navbar({ activePage, setPage }) {
  return (
    <nav className="mb-4 pb-2 border-b">
      <button
        onClick={() => setPage("jobs")}
        style={{ fontWeight: activePage === "jobs" ? "bold" : "normal" }}
        className="mr-4"
      >
        Jobs
      </button>
      <button
        onClick={() => setPage("diagrams")}
        style={{ fontWeight: activePage === "diagrams" ? "bold" : "normal" }}
      >
        Diagrams
      </button>
    </nav>
  );
}
