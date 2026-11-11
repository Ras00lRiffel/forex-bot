export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export const SYMBOLS = ["EUR_USD", "GBP_USD", "USD_JPY"] as const;
export type SymbolCode = (typeof SYMBOLS)[number];

export const TIMEFRAMES = ["M15", "H1"] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];

const pairConfig: Record<SymbolCode, { base: number; pip: number }> = {
  EUR_USD: { base: 1.085, pip: 0.0001 },
  GBP_USD: { base: 1.271, pip: 0.0001 },
  USD_JPY: { base: 149.5, pip: 0.01 }
};

export function getDemoCandles(
  symbol: SymbolCode,
  timeframe: Timeframe,
  requestedLimit = 200
): Candle[] {
  const limit = Math.max(50, Math.min(500, requestedLimit));
  const { base, pip } = pairConfig[symbol];
  const interval = timeframe === "M15" ? 15 * 60 : 60 * 60;
  const now = Math.floor(Date.now() / interval) * interval;
  let previous = base;
  const candles: Candle[] = [];

  let seed =
    symbol.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) +
    (timeframe === "M15" ? 15 : 60);

  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = limit - 1; i >= 0; i--) {
    const phase = (limit - i) / 17;
    const drift =
      Math.sin(phase / 2.8) * pip * 0.45 +
      (rand() - 0.51) * pip * 1.8;

    const open = previous;
    const close = Math.max(pip, open + drift);
    const high = Math.max(open, close) + rand() * pip * 0.7;
    const low = Math.min(open, close) - rand() * pip * 0.7;
    const decimals = symbol === "USD_JPY" ? 3 : 5;

    candles.push({
      time: now - i * interval,
      open: Number(open.toFixed(decimals)),
      high: Number(high.toFixed(decimals)),
      low: Number(low.toFixed(decimals)),
      close: Number(close.toFixed(decimals))
    });

    previous = close;
  }

  return candles;
}

type TwelveDataValue = {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
};

type TwelveDataResponse = {
  status?: string;
  message?: string;
  code?: number;
  values?: TwelveDataValue[];
};

export async function getTwelveDataCandles(
  symbol: SymbolCode,
  timeframe: Timeframe,
  requestedLimit = 200
): Promise<Candle[]> {
  const apiKey = process.env.TWELVE_DATA_API_KEY;

  if (!apiKey) {
    throw new Error("TWELVE_DATA_API_KEY is not configured.");
  }

  const baseUrl = (
    process.env.TWELVE_DATA_BASE_URL ?? "https://api.twelvedata.com"
  ).replace(/\/+$/, "");

  const params = new URLSearchParams({
    symbol: symbol.replace("_", "/"),
    interval: timeframe === "M15" ? "15min" : "1h",
    outputsize: String(Math.max(50, Math.min(500, requestedLimit))),
    timezone: "UTC",
    order: "ASC",
    apikey: apiKey
  });

  const response = await fetch(
    `${baseUrl}/time_series?${params.toString()}`,
    { signal: AbortSignal.timeout(15000) }
  );

  if (!response.ok) {
    throw new Error(`Twelve Data HTTP error: ${response.status}`);
  }

  const data = (await response.json()) as TwelveDataResponse;

  if (data.status !== "ok" || !Array.isArray(data.values)) {
    throw new Error(
      `Twelve Data error: ${data.message ?? "Invalid API response"}`
    );
  }

  const candles: Candle[] = data.values.map((value) => {
    const time = Date.parse(`${value.datetime.replace(" ", "T")}Z`) / 1000;

    const candle = {
      time,
      open: Number(value.open),
      high: Number(value.high),
      low: Number(value.low),
      close: Number(value.close)
    };

    if (
      !Number.isFinite(candle.time) ||
      !Number.isFinite(candle.open) ||
      !Number.isFinite(candle.high) ||
      !Number.isFinite(candle.low) ||
      !Number.isFinite(candle.close)
    ) {
      throw new Error("Twelve Data returned an invalid candle.");
    }

    return candle;
  });

  return candles.sort((a, b) => a.time - b.time);
}