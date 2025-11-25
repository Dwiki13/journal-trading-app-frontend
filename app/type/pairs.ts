export type PairType = "crypto" | "forex" | "commodity";

export interface PairParams {
    type?: PairType
    search?: string;
}

export interface PairsResponse {
  status: boolean;
  status_code: number;
  message: string;
  type: string;
  data: string[];
  total: number;
}
