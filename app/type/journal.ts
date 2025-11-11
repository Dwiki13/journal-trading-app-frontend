// types/journal.ts

export type JournalWinLose = "win" | "lose" | "draw";

export interface Journal {
  id: string;
  user_id: string;
  modal: string;
  modal_type: string;
  tanggal: string; // ISO date
  pair: string;
  side: "buy" | "sell";
  lot: number;
  harga_entry: number;
  harga_take_profit: number;
  harga_stop_loss: number;
  analisa_before: string; // URL
  analisa_after: string;  // URL
  reason: string;
  win_lose: JournalWinLose;
  profit: number;
  created_at: string; // ISO datetime
}

// --- GET Journals Response ---
export interface GetJournalsResponse {
  status: boolean;
  status_code: number;
  message: string;
  data: Journal[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// --- Body untuk Create / Update Journal ---
// Untuk file upload kita bisa pakai FormData, jadi tipe ini hanya untuk reference
export interface JournalFormBody {
  modal: string;
  modal_type: string;
  tanggal: string;
  pair: string;
  side: "buy" | "sell";
  lot: number;
  harga_entry: number;
  harga_take_profit: number;
  harga_stop_loss: number;
  reason: string;
  win_lose: JournalWinLose;
  profit: number;
  // file upload menggunakan FormData
  analisaBefore?: File;
  analisaAfter?: File;
}

// --- Optional helper untuk dashboard / charts ---
export interface EquityPoint {
  date: string;
  equity: number;
}

export interface ProfitPerInstrument {
  pair: string;
  profit: number;
}

export interface DailyPerformance {
  date: string;
  profit: number;
}
