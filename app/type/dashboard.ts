export interface Daily {
  date: string;
  pnl: number;
}

export interface Weekly {
  week: string;
  pnl: number;
}

export interface Pair {
  date: string;
  pnl: number;
}

export interface Dashboard {
  equity: number;
  total_pnl: number;
  avg_rr: number;
  win_rate: number;
  max_drawdown_percent: number;
  total_trades: number;
  avg_profit_per_trade: number;
  avg_loss_per_trade: number;
  profit_factor: number;
  largest_win: number;
  largest_loss: number;
  most_traded_pair: string;
  consecutive_wins: number;
  consecutive_losses: number;
  daily: Daily[];
  weekly: Weekly[];
  profit_per_pair: Pair[];
}

export interface GetDashboardResponse {
  status: boolean;
  status_code: number;
  message: string;
  data: Dashboard;
}
