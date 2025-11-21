import { apiProxy } from "@/lib/api";
import { PairParams, PairsResponse } from "@/app/type/pairs";

export const getPairs = async (params?: PairParams): Promise<PairsResponse> => {
  const response = await apiProxy.get<PairsResponse>("functions/v1/pairs", {
    params,
    headers: {
      "x-proxy-secret": process.env.NEXT_PUBLIC_PROXY_SECRET,
    },
  });
  return response.data;
};
