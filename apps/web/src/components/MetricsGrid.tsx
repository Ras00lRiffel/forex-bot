import { AlertTriangle, Database, ShieldCheck, Wifi } from "lucide-react";

import type { Config } from "../types";

type MetricsGridProps = {
  config: Config | null;
  apiOnline: boolean;
};

export default function MetricsGrid({ config, apiOnline }: MetricsGridProps) {
  const money = (n: number) =>
    new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 2,
    }).format(n);

  const balance = config?.startingBalanceSar ?? 100;
  const risk = config?.riskPerTradePct ?? 0.25;
  const dailyLoss = config?.dailyLossLimitPct ?? 1;

  return (
    <section className="metric-grid">
      <article className="metric-card">
        <div className="metric-top">
          <span>Virtual balance</span>
          <Database size={17} />
        </div>

        <div className="metric-value">{money(balance)}</div>

        <div className="metric-foot">
          <span className="tiny-tag">SAR account</span>
          <span>Paper only</span>
        </div>
      </article>

      <article className="metric-card">
        <div className="metric-top">
          <span>Risk per trade</span>
          <ShieldCheck size={17} />
        </div>

        <div className="metric-value">{money((balance * risk) / 100)}</div>

        <div className="metric-foot">
          <span>{risk}% of equity</span>
        </div>
      </article>

      <article className="metric-card">
        <div className="metric-top">
          <span>Daily loss cutoff</span>
          <AlertTriangle size={17} />
        </div>

        <div className="metric-value">{money((balance * dailyLoss) / 100)}</div>

        <div className="metric-foot">
          <span>{dailyLoss}% of start-of-day equity</span>
        </div>
      </article>

      <article className="metric-card">
        <div className="metric-top">
          <span>Market feed</span>
          <Wifi size={17} />
        </div>

        <div className="metric-value small-value">
          {apiOnline ? "Connected" : "Offline"}
        </div>

        <div className="metric-foot">
          <span className={`status-dot ${apiOnline ? "green" : "red"}`} />
          <span>{apiOnline ? "Local API responding" : "Waiting for API"}</span>
        </div>
      </article>
    </section>
  );
}
