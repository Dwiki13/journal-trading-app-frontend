// stores/journalStore.ts
import api from "@/lib/api";
import { GetJournalsResponse, JournalFormBody, Journal } from "@/app/type/journal";

interface GetJournalsParams {
  page?: number;
  limit?: number;
  pair?: string;
  side?: string;
  win_lose?: "win" | "lose" | "draw";
  date_from?: string;
  date_to?: string;
  sort_by?: string; 
  sort_order?: "asc" | "desc";
}

export const getJournals = async (params?: GetJournalsParams): Promise<GetJournalsResponse> => {
  const response = await api.get<GetJournalsResponse>("/functions/v1/get-journal", { params });
  return response.data;
};

export const createJournal = async (formData: FormData): Promise<Journal> => {
  const response = await api.post<Journal>(
    "/functions/v1/add-journal",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};

export const updateJournal = async (id: string, formData: FormData): Promise<Journal> => {
  formData.append("id", id);

  const response = await api.put<Journal>(
    "/functions/v1/update-journal",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return response.data;
};
