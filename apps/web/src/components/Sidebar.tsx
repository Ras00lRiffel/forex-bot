import { Activity, ChartNoAxesCombined, Database, Bot } from "lucide-react";

type SidebarProps = {
  apiOnline: boolean;
};

export default function Sidebar({ apiOnline }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <ChartNoAxesCombined size={21} />
        </div>

        <div>
          <strong>TradeLab</strong>
          <span>FOREX PAPER BOT</span>
        </div>
      </div>

      <div className="nav-label">WORKSPACE</div>

      <div className="nav-item active">
        <Activity size={17} /> Overview
      </div>

      <div className="nav-item muted">
        <ChartNoAxesCombined size={17} />
        Market scanner
        <small>PHASE 2</small>
      </div>

      <div className="nav-item muted">
        <Bot size={17} />
        Strategy engine
        <small>PHASE 2</small>
      </div>

      <div className="nav-item muted">
        <Database size={17} />
        Trade journal
        <small>PHASE 3</small>
      </div>

      <div className="sidebar-bottom">
        <div className="status-line">
          <span className={`status-dot ${apiOnline ? "green" : "red"}`} />
          {apiOnline ? "API connected" : "API disconnected"}
        </div>

        <div className="side-note">
          Real-money trading is disabled in this build.
        </div>
      </div>
    </aside>
  );
}
