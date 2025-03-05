import { useMemo } from "react";
import "./App.css";
import { useStatistics } from "./useStatistics";
import Chart from "./Chart";

function App() {
  const statistics = useStatistics(10);
  const cpuUsages = useMemo(
    () => statistics.map((stat) => stat.cpuUsage),
    [statistics]
  );
  const ramUsages = useMemo(
    () => statistics.map((stat) => stat.ramUsage),
    [statistics]
  );
  const storageUsages = useMemo(
    () => statistics.map((stat) => stat.storageUsage),
    [statistics]
  );

  return (
    <div
      style={{
        width: "50vw",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div style={{ height: 120 }}>
          CPU usage: <Chart data={cpuUsages} maxDataPoints={10} />
        </div>
        <div style={{ height: 120 }}>
          RAM usage: <Chart data={ramUsages} maxDataPoints={10} />
        </div>
        <div style={{ height: 120 }}>
          C disk usage:
          <Chart data={storageUsages} maxDataPoints={10} />
        </div>
      </div>
    </div>
  );
}

export default App;
