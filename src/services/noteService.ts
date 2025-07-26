import axios from "axios";
import type { Note } from "../types/note";

const API_BASE_URL = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  perPage: number,
  search: string = ""
): Promise<FetchNotesResponse> => {
  try {
    const params: { page: number; perPage: number; search?: string } = {
      page,
      perPage,
    };
    if (search) {
      params.search = search;
    }
    const response = await axios.get<FetchNotesResponse>(
      `${API_BASE_URL}/notes`,
      {
        params,
        headers: { Authorization: `Bearer ${TOKEN}` },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Fetch notes error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
    throw error;
  }
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">
): Promise<Note> => {
  try {
    const response = await axios.post<Note>(`${API_BASE_URL}/notes`, note, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Create note error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
    throw error;
  }
};

export const deleteNote = async (id: number): Promise<Note> => {
  try {
    const response = await axios.delete<Note>(`${API_BASE_URL}/notes/${id}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Delete note error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
    throw error;
  }
};