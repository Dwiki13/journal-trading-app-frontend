// stores/journalStore.ts
import api from "@/lib/api";
import { GetJournalsResponse, JournalFormBody, Journal } from "@/app/type/journal";

// --- Get Journals with filters & pagination ---
interface GetJournalsParams {
  page?: number;
  limit?: number;
  pair?: string;
  win_lose?: "win" | "lose" | "draw";
  date_from?: string;
  date_to?: string;
  sort_by?: string; // e.g., "tanggal"
  sort_order?: "asc" | "desc";
}

export const getJournals = async (params?: GetJournalsParams): Promise<GetJournalsResponse> => {
  const response = await api.get<GetJournalsResponse>("/functions/v1/get-journal", { params });
  return response.data;
};

// --- Create Journal ---
export const createJournal = async (body: JournalFormBody): Promise<Journal> => {
  const formData = new FormData();
  Object.entries(body).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === "analisaBefore" || key === "analisaAfter") {
        formData.append(key, value as File);
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  const response = await api.post<Journal>("/functions/v1/add-journal", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// --- Update Journal ---
export const updateJournal = async (id: string, body: JournalFormBody): Promise<Journal> => {
  const formData = new FormData();
  formData.append("id", id);
  Object.entries(body).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === "analisaBefore" || key === "analisaAfter") {
        formData.append(key, value as File);
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  const response = await api.put<Journal>("/functions/v1/update-journal", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};
