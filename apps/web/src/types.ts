
export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type Config = {
  mode: string;
  dataIsSynthetic: boolean;
  liveTradingEnabled: boolean;
  startingBalanceSar: number;
  riskPerTradePct: number;
  dailyLossLimitPct: number;
  weeklyDrawdownLimitPct: number;
  maxOpenPositions: number;
  maxTradesPerDay: number;
  symbols: string[];
  timeframes: string[];
};

export type SymbolCode = "EUR_USD" | "GBP_USD" | "USD_JPY";

export type Timeframe = "M15" | "H1";
