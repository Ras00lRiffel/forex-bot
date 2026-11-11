# TradeLab — Forex Paper Bot (Phase 1)

A starter monorepo for a forex intraday research/paper-trading system. It includes a React dashboard, Express + TypeScript API, Lightweight Charts candlestick display, MySQL schema, and conservative configuration values for a **100 SAR virtual account**.

## Important safety/data note

**The current chart data is synthetic and generated for UI development. It is not live or historical forex data. Do not use it for backtests, strategy decisions, or trading.** Phase 1 has no broker integration, no order endpoint, and live trading is hard-disabled. The next step is connecting a legitimate historical/market-data source and storing actual candles before strategy testing.

## Requirements

- Node.js 20+ recommended
- npm 10+ recommended
- MySQL 8+ optional for this first UI milestone

## Run locally

From the project root:

```bash
cp .env.example .env
npm install
npm run dev
```

Open the dashboard at `http://localhost:5173`. The API is at `http://localhost:5000/api/health`.

To access it from another device on your home network, use the Linux server's LAN IP instead of `localhost` in the browser, and set `VITE_API_BASE` in `apps/web/.env.local` to `http://YOUR_LINUX_IP:5000`. Ensure the firewall allows ports 5173 and 5000 only on your trusted LAN. Do not expose these development ports directly to the public internet.

## API endpoints

- `GET /api/health` — health, mode and live-trading status
- `GET /api/config` — account/risk configuration
- `GET /api/market/candles?symbol=EUR_USD&timeframe=M15&limit=200` — synthetic demo candles
- `GET /api/db-status` — optional MySQL connection check

Allowed symbols: `EUR_USD`, `GBP_USD`, `USD_JPY`. Timeframes: `M15`, `H1`. Candle limit: 50–500.

## Optional MySQL setup

Create a database and tables with the supplied schema. Example, after creating a dedicated MySQL user with privileges limited to this database:

```bash
mysql -u root -p < database/schema.sql
```

Then set `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` in `.env`. Do not use your MySQL root account in the app. Keep `.env` out of Git.

## Scripts

```bash
npm run dev       # run API and dashboard
npm run typecheck # TypeScript checks
npm run build     # production builds
```

## Phase roadmap

1. **Phase 1 (this starter):** dashboard, API, configurable 100 SAR account, chart UI and database schema.
2. **Next:** connect a real, appropriately licensed historical candle source; validate timestamps, gaps, bid/ask spread and source provenance; persist candles to MySQL.
3. Add strategy signals (H1 trend filter + M15 pullback) without orders.
4. Add historical backtesting with spreads, commission, slippage, no look-ahead bias, and out-of-sample evaluation.
5. Add a paper broker that simulates fills and enforces position size, stop loss, daily loss, weekly drawdown, and duplicate-order controls.
6. Add broker demo integration only after confirming availability and suitability for your account location.

## Risk settings currently displayed

- Starting virtual balance: 100 SAR
- Risk per trade: 0.25% (0.25 SAR at starting equity)
- Daily loss cutoff: 1% (1 SAR at start-of-day equity)
- Weekly drawdown cutoff: 3% (3 SAR at starting weekly equity)
- Max simultaneous positions: 1
- Max trades/day: 3

These are research configuration values, not claims that such small risk amounts are practical with a live broker. The simulator should reject trades whose minimum size or transaction costs make them unsuitable.
