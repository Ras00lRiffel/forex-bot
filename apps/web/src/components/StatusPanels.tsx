import { ShieldCheck } from "lucide-react";

import type { Config } from "../types";

type StatusPanelsProps = {
  config: Config | null;
};

export default function StatusPanels({ config }: StatusPanelsProps) {
  const money = (n: number) =>
    new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
      maximumFractionDigits: 2,
    }).format(n);

  const balance = config?.startingBalanceSar ?? 100;
  const weeklyLimit = config?.weeklyDrawdownLimitPct ?? 3;

  return (
    <section className="lower-grid">
      <article className="panel info-panel">
        <div className="panel-header">
          <div>
            <div className="eyebrow">SYSTEM STATUS</div>
            <h2>Phase 1 checklist</h2>
          </div>

          <span className="pill neutral">IN PROGRESS</span>
        </div>

        <div className="checklist">
          <div>
            <span className="check done">✓</span>
            <span>Dashboard and pair selector</span>
            <strong>Ready</strong>
          </div>

          <div>
            <span className="check done">✓</span>
            <span>API and demo candle endpoint</span>
            <strong>Ready</strong>
          </div>

          <div>
            <span className="check pending">•</span>
            <span>Real historical price data</span>
            <strong>Next</strong>
          </div>

          <div>
            <span className="check pending">•</span>
            <span>MySQL persistence</span>
            <strong>Next</strong>
          </div>

          <div>
            <span className="check locked">–</span>
            <span>Strategy and paper orders</span>
            <strong>Phase 2–3</strong>
          </div>
        </div>
      </article>

      <article className="panel info-panel">
        <div className="panel-header">
          <div>
            <div className="eyebrow">RISK CONFIGURATION</div>
            <h2>Account guardrails</h2>
          </div>

          <ShieldCheck size={18} />
        </div>

        <div className="guardrail">
          <span>Maximum open positions</span>
          <strong>{config?.maxOpenPositions ?? 1}</strong>
        </div>

        <div className="guardrail">
          <span>Maximum trades per day</span>
          <strong>{config?.maxTradesPerDay ?? 3}</strong>
        </div>

        <div className="guardrail">
          <span>Weekly drawdown cutoff</span>
          <strong>{money((balance * weeklyLimit) / 100)}</strong>
        </div>

        <div className="safe-note">
          <ShieldCheck size={15} />
          No live broker connection or order execution exists in this version.
        </div>
      </article>
    </section>
  );
}
