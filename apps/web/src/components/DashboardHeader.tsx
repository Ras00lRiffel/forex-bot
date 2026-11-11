import { ShieldCheck } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="topbar">
      <div>
        <div className="eyebrow">PAPER TRADING WORKSPACE</div>
        <h1>Market overview</h1>
      </div>

      <div className="topbar-right">
        <span className="pill demo">
          <span className="status-dot green" />
          DEMO MODE
        </span>

        <span className="pill disabled">
          <ShieldCheck size={14} />
          LIVE TRADING OFF
        </span>
      </div>
    </header>
  );
}
