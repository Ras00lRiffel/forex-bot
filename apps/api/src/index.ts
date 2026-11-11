import dotenv from "dotenv";
import path from "node:path";
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import {
  getDemoCandles,
  getTwelveDataCandles,
  SYMBOLS,
  TIMEFRAMES,
  type SymbolCode,
  type Timeframe
} from "./marketData.js";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

const app = express();
const port = Number(process.env.PORT ?? 5000);
const host = process.env.HOST ?? "0.0.0.0";
const startingBalanceSar = Number(process.env.STARTING_BALANCE_SAR ?? 100);
app.use(cors());
app.use(express.json());

const isSymbol = (value: string): value is SymbolCode => SYMBOLS.includes(value as SymbolCode);
const isTimeframe = (value: string): value is Timeframe => TIMEFRAMES.includes(value as Timeframe);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "forex-bot-api", mode: process.env.DATA_MODE ?? "demo", liveTradingEnabled: false, timestamp: new Date().toISOString() });
});

app.get("/api/config", (_req, res) => {
  const mode = process.env.DATA_MODE ?? "demo";
  res.json({
    mode: mode,
    dataIsSynthetic: mode === "demo",
    liveTradingEnabled: false,
    startingBalanceSar,
    riskPerTradePct: 0.25,
    dailyLossLimitPct: 1,
    weeklyDrawdownLimitPct: 3,
    maxOpenPositions: 1,
    maxTradesPerDay: 3,
    symbols: SYMBOLS,
    timeframes: TIMEFRAMES
  });
});

app.get("/api/market/candles", async (req, res) => {
  const symbol = String(req.query.symbol ?? "EUR_USD");
  const timeframe = String(req.query.timeframe ?? "M15");
  const limit = Number(req.query.limit ?? 200);

  if (!isSymbol(symbol)) {
    return res.status(400).json({
      error: `Unsupported symbol. Choose: ${SYMBOLS.join(", ")}`
    });
  }

  if (!isTimeframe(timeframe)) {
    return res.status(400).json({
      error: `Unsupported timeframe. Choose: ${TIMEFRAMES.join(", ")}`
    });
  }

  if (!Number.isFinite(limit) || limit < 50 || limit > 500) {
    return res.status(400).json({
      error: "limit must be between 50 and 500"
    });
  }

  const mode = process.env.DATA_MODE ?? "demo";

  try {
    if (mode === "twelvedata") {
      const candles = await getTwelveDataCandles(
        symbol,
        timeframe,
        limit
      );

      return res.json({
        symbol,
        timeframe,
        source: "twelve-data",
        dataIsSynthetic: false,
        liveTradingEnabled: false,
        candles
      });
    }

    return res.json({
      symbol,
      timeframe,
      source: "synthetic-demo",
      dataIsSynthetic: true,
      liveTradingEnabled: false,
      warning:
        "Synthetic demonstration candles only. Do not use for strategy evaluation.",
      candles: getDemoCandles(symbol, timeframe, limit)
    });
  } catch (error) {
    console.error("Market data error:", error);

    return res.status(502).json({
      error: "Unable to retrieve market data. Check the API configuration and provider response."
    });
  }
});

app.get("/api/db-status", async (_req, res) => {
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
    return res.json({ configured: false, connected: false, message: "MySQL is optional in Phase 1. Configure DB_* in .env when ready." });
  }
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD ?? "",
      database: process.env.DB_NAME,
      connectTimeout: 2500
    });
    await connection.ping();
    await connection.end();
    return res.json({ configured: true, connected: true, message: "MySQL connection successful." });
  } catch {
    return res.status(503).json({ configured: true, connected: false, message: "MySQL is configured but the connection failed. Check DB_* values and ensure the schema/database exists." });
  }
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error" });
});

app.listen(port, host, () => {
  console.log(`Forex bot API listening on http://${host}:${port}`);
  console.log(`Mode: ${process.env.DATA_MODE ?? "demo"}. Live trading is hard-disabled in Phase 1.`);
});
