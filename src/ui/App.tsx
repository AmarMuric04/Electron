import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { useStatistics } from "./useStatistics";
import Chart from "./Chart";

function App() {
  const [activeView, setActiveView] = useState<View>("CPU");
  const staticData = useStaticData();
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
    <div>
      <Header />
      <div className="main">
        <div>
          <SelectOption
            title="CPU"
            subTitle={staticData?.cpuModel ?? ""}
            data={cpuUsages}
            onClick={() => setActiveView("CPU")}
            view="CPU"
          />
          <SelectOption
            title="RAM"
            subTitle={(staticData?.totalMemoryGB.toString() ?? "") + "GB"}
            data={ramUsages}
            onClick={() => setActiveView("RAM")}
            view="RAM"
          />
          <SelectOption
            title="STORAGE"
            subTitle={(staticData?.totalStorage.toString() ?? "") + " GB"}
            data={storageUsages}
            onClick={() => setActiveView("STORAGE")}
            view="STORAGE"
          />
        </div>
        <div className="mainGrid">
          <Chart
            data={activeUsages ? activeUsages : []}
            maxDataPoints={10}
            selectedView={activeView}
          />
        </div>
      </div>
    </div>
  );
}

function SelectOption({
  title,
  view,
  subTitle,
  data,
  onClick,
}: {
  title: string;
  view: View;
  subTitle: string;
  data: number[];
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="selectOption">
      <div className="selectOptionTitle">
        <div>{title}</div>
        <div>{subTitle}</div>
      </div>
      <div className="selectOptionChart">
        <Chart data={data ? data : []} maxDataPoints={5} selectedView={view} />
      </div>
    </button>
  );
}

function useStaticData() {
  const [staticData, setStaticData] = useState<StaticData | null>(null);

  useEffect(() => {
    (async () => {
      setStaticData(await window.electron.getStaticData());
    })();
  }, []);

  return staticData;
}

function Header() {
  return (
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
  );
}

export default App;
