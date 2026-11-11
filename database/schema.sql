CREATE DATABASE IF NOT EXISTS forex_bot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE forex_bot;

CREATE TABLE IF NOT EXISTS candles (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(12) NOT NULL,
  timeframe VARCHAR(8) NOT NULL,
  candle_time DATETIME NOT NULL,
  open_price DECIMAL(16,8) NOT NULL,
  high_price DECIMAL(16,8) NOT NULL,
  low_price DECIMAL(16,8) NOT NULL,
  close_price DECIMAL(16,8) NOT NULL,
  source VARCHAR(32) NOT NULL DEFAULT 'unknown',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_candle (symbol, timeframe, candle_time),
  KEY idx_candle_lookup (symbol, timeframe, candle_time)
);

CREATE TABLE IF NOT EXISTS strategy_signals (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  symbol VARCHAR(12) NOT NULL,
  timeframe VARCHAR(8) NOT NULL,
  direction ENUM('LONG','SHORT') NOT NULL,
  status ENUM('PROPOSED','APPROVED','REJECTED','EXPIRED') NOT NULL DEFAULT 'PROPOSED',
  entry_price DECIMAL(16,8) NULL,
  stop_loss DECIMAL(16,8) NULL,
  take_profit DECIMAL(16,8) NULL,
  rationale JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_signal_status_created (status, created_at)
);

CREATE TABLE IF NOT EXISTS paper_orders (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  signal_id BIGINT UNSIGNED NULL,
  symbol VARCHAR(12) NOT NULL,
  direction ENUM('LONG','SHORT') NOT NULL,
  order_type ENUM('MARKET','LIMIT') NOT NULL DEFAULT 'MARKET',
  status ENUM('PENDING','OPEN','CLOSED','CANCELLED','REJECTED') NOT NULL DEFAULT 'PENDING',
  units DECIMAL(18,4) NOT NULL,
  requested_entry DECIMAL(16,8) NULL,
  fill_price DECIMAL(16,8) NULL,
  stop_loss DECIMAL(16,8) NULL,
  take_profit DECIMAL(16,8) NULL,
  realized_pnl_sar DECIMAL(16,4) NOT NULL DEFAULT 0,
  opened_at DATETIME NULL,
  closed_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_paper_order_signal FOREIGN KEY (signal_id) REFERENCES strategy_signals(id) ON DELETE SET NULL,
  KEY idx_paper_order_status (status, created_at)
);

CREATE TABLE IF NOT EXISTS account_snapshots (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  balance_sar DECIMAL(16,4) NOT NULL,
  equity_sar DECIMAL(16,4) NOT NULL,
  open_pnl_sar DECIMAL(16,4) NOT NULL DEFAULT 0,
  snapshot_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_snapshot_time (snapshot_at)
);

CREATE TABLE IF NOT EXISTS bot_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  level ENUM('INFO','WARN','ERROR') NOT NULL DEFAULT 'INFO',
  event_type VARCHAR(64) NOT NULL,
  message TEXT NOT NULL,
  metadata JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_event_type_time (event_type, created_at)
);
