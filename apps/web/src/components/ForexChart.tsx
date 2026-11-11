import { useEffect, useRef } from "react";

import {
  createChart,
  CandlestickSeries,
  ColorType,
  type IChartApi,
  type CandlestickData,
  type Time,
} from "lightweight-charts";

import type { Candle } from "../types";

type ForexChartProps = {
  candles: Candle[];
  symbol: string;
};

export default function ForexChart({ candles, symbol }: ForexChartProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const chart = createChart(hostRef.current, {
      autoSize: true,

      layout: {
        background: {
          type: ColorType.Solid,
          color: "#0b1220",
        },
        textColor: "#9aa9c1",
        attributionLogo: false,
      },

      grid: {
        vertLines: { color: "#172235" },
        horzLines: { color: "#172235" },
      },

      rightPriceScale: {
        borderColor: "#243149",
      },

      timeScale: {
        borderColor: "#243149",
        timeVisible: true,
        secondsVisible: false,
      },

      crosshair: {
        vertLine: { color: "#65748b" },
        horzLine: { color: "#65748b" },
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#26c99a",
      downColor: "#f06475",
      borderUpColor: "#26c99a",
      borderDownColor: "#f06475",
      wickUpColor: "#26c99a",
      wickDownColor: "#f06475",
    });

    series.setData(
      candles.map((c) => ({
        ...c,
        time: c.time as Time,
      })) as CandlestickData<Time>[],
    );

    chart.timeScale().fitContent();

    chartRef.current = chart;

    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [candles, symbol]);

  return (
    <div
      ref={hostRef}
      className="chart-host"
      aria-label={`${symbol} candlestick chart`}
    />
  );
}
