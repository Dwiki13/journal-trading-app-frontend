import api from "@/lib/api";
import { GetDashboardResponse } from "../type/dashboard";

export const getDashboards = async (): Promise<GetDashboardResponse> => {
  const response = await api.get<GetDashboardResponse>(
    "/functions/v1/dashboard"
  );
  return response.data;
};
