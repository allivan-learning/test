import type { Note, NoteTag } from '../types/note';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

interface FetchNotesParams {
  search?: string;
  tag?: NoteTag;
  page: number;
  perPage: number;
}

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
export const fetchNotes = async (
  params: FetchNotesParams,
): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>('/notes', { params });
  return response.data;
};

interface DeleteNoteParams {
  id: string;
}

export const deleteNote = async ({ id }: DeleteNoteParams): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};

interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export const createNote = async ({
  title,
  content,
  tag,
}: CreateNoteParams): Promise<Note> => {
  const response = await api.post<Note>('/notes', { title, content, tag });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};
