import { ArrowDownRight, ArrowUpRight, Clock3 } from "lucide-react";

import ForexChart from "./ForexChart";
import type { Candle, SymbolCode, Timeframe } from "../types";

type MarketChartPanelProps = {
  symbol: SymbolCode;
  timeframe: Timeframe;
  candles: Candle[];
  onSymbolChange: (symbol: SymbolCode) => void;
  onTimeframeChange: (timeframe: Timeframe) => void;
};

export default function MarketChartPanel({
  symbol,
  timeframe,
  candles,
  onSymbolChange,
  onTimeframeChange,
}: MarketChartPanelProps) {
  const latest = candles.at(-1);
  const previous = candles.at(-2);

  const change = latest && previous ? latest.close - previous.close : 0;

  const isUp = change >= 0;
  const decimals = symbol === "USD_JPY" ? 3 : 5;

  return (
    <section className="panel chart-panel">
      <div className="panel-header chart-header">
        <div>
          <div className="eyebrow">MARKET CHART</div>

          <h2>
            {symbol.replace("_", "/")}
            <span className="timeframe-label">{timeframe}</span>
          </h2>
        </div>

        <div className="chart-controls">
          <select
            aria-label="Currency pair"
            value={symbol}
            onChange={(e) => onSymbolChange(e.target.value as SymbolCode)}
          >
            <option value="EUR_USD">EUR/USD</option>
            <option value="GBP_USD">GBP/USD</option>
            <option value="USD_JPY">USD/JPY</option>
          </select>

          <div className="segmented">
            {(["M15", "H1"] as const).map((tf) => (
              <button
                key={tf}
                className={timeframe === tf ? "selected" : ""}
                onClick={() => onTimeframeChange(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="price-strip">
        <div>
          <span className="price-label">LAST DEMO CLOSE</span>

          <strong>{latest ? latest.close.toFixed(decimals) : "—"}</strong>
        </div>

        <div className={`change-value ${isUp ? "positive" : "negative"}`}>
          {isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}

          {latest && previous ? Math.abs(change).toFixed(decimals) : "—"}
        </div>

        <div className="price-meta">
          <Clock3 size={14} />

          {latest
            ? new Date(latest.time * 1000).toLocaleString()
            : "Loading candles…"}
        </div>
      </div>

      {candles.length ? (
        <ForexChart candles={candles} symbol={symbol} />
      ) : (
        <div className="chart-loading">Loading chart…</div>
      )}

      <div className="chart-footer">
        <span>
          <span className="legend-dot green-bg" />
          Bull candle
        </span>

        <span>
          <span className="legend-dot red-bg" />
          Bear candle
        </span>

        <span className="chart-foot-note">
          200 generated candles · Not live market data
        </span>
      </div>
    </section>
  );
}
