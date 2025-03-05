import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { useStatistics } from "./useStatistics";
import Chart from "./Chart";

function App() {
  const [activeView, setActiveView] = useState<View>("CPU");
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

  const activeUsages = useMemo(() => {
    switch (activeView) {
      case "CPU":
        return cpuUsages;
      case "RAM":
        return ramUsages;
      case "STORAGE":
        return storageUsages;
    }
  }, [cpuUsages, ramUsages, storageUsages, activeView]);

  useEffect(() => {
    window.electron.subscribeChangeView((view) => setActiveView(view));
  }, []);

  return (
    <div
      style={{
        width: "50vw",
      }}
    >
      <header>
        <button
          id="close"
          onClick={() => window.electron.sendFrameAction("CLOSE")}
        />
        <button
          id="minimize"
          onClick={() => window.electron.sendFrameAction("MINIMIZE")}
        />
        <button
          id="maximize"
          onClick={() => window.electron.sendFrameAction("MAXIMIZE")}
        />
      </header>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div style={{ height: 120 }}>
          <Chart data={activeUsages ? activeUsages : []} maxDataPoints={10} />
        </div>
      </div>
    </div>
  );
}

export default App;
