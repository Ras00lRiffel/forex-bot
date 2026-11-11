import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

import Sidebar from "./components/Sidebar";
import DashboardHeader from "./components/DashboardHeader";
import MetricsGrid from "./components/MetricsGrid";
import MarketChartPanel from "./components/MarketChartPanel";
import StatusPanels from "./components/StatusPanels";

import type { Candle, Config, SymbolCode, Timeframe } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:5000";

export default function App() {
  const [symbol, setSymbol] = useState<SymbolCode>("EUR_USD");
  const [timeframe, setTimeframe] = useState<Timeframe>("M15");

  const [candles, setCandles] = useState<Candle[]>([]);
  const [config, setConfig] = useState<Config | null>(null);

  const [apiOnline, setApiOnline] = useState(false);
  const [error, setError] = useState("");

  // Load application configuration.
  useEffect(() => {
    let active = true;

    fetch(`${API_BASE}/api/config`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("API config request failed");
        }

        return response.json();
      })
      .then((data: Config) => {
        if (active) {
          setConfig(data);
          setApiOnline(true);
        }
      })
      .catch(() => {
        if (active) {
          setApiOnline(false);
          setError(
            `Cannot reach the API at ${API_BASE}. Start the API server and refresh.`,
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Load market candles whenever the selected market changes.
  useEffect(() => {
    let active = true;

    setError("");

    fetch(
      `${API_BASE}/api/market/candles?symbol=${encodeURIComponent(symbol)}&timeframe=${encodeURIComponent(timeframe)}&limit=200`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Candle request failed");
        }

        return response.json();
      })
      .then((data: { candles: Candle[] }) => {
        if (active) {
          setCandles(data.candles);
        }
      })
      .catch(() => {
        if (active) {
          setError(
            `Could not load chart data from ${API_BASE}. Check that the API is running.`,
          );
        }
      });

    return () => {
      active = false;
    };
  }, [symbol, timeframe]);

  return (
    <div className="app-shell">
      <Sidebar apiOnline={apiOnline} />

      <main className="main-content">
        <DashboardHeader />

        {error && (
          <div className="error-banner">
            <AlertTriangle size={17} />
            {error}
          </div>
        )}

        <div className="warning-banner">
          <AlertTriangle size={18} />

          <div>
            <strong>Synthetic demo data</strong>

            <span>
              This chart uses generated placeholder candles, not real forex
              prices. It is only for testing the dashboard; do not use it to
              evaluate a strategy or make trading decisions.
            </span>
          </div>
        </div>

        <MetricsGrid config={config} apiOnline={apiOnline} />

        <MarketChartPanel
          symbol={symbol}
          timeframe={timeframe}
          candles={candles}
          onSymbolChange={setSymbol}
          onTimeframeChange={setTimeframe}
        />

        <StatusPanels config={config} />

        <footer>
          TradeLab v0.1.0
          <span>Built for controlled research · Not financial advice</span>
        </footer>
      </main>
    </div>
  );
}
