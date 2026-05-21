import { api } from './client';
import type { Session } from '@/types';

export const sessionsApi = {
  getAll: async (filters?: { status?: string; agentId?: string }): Promise<Session[]> => {
    const { data } = await api.get<Session[]>('/sessions', { params: filters });
    return data;
  },

  getOne: async (id: string): Promise<Session> => {
    const { data } = await api.get<Session>(`/sessions/${id}`);
    return data;
  },

  create: async (session: { agentId: string; title?: string }): Promise<Session> => {
    const { data } = await api.post<Session>('/sessions', session);
    return data;
  },

  close: async (id: string): Promise<Session> => {
    const { data } = await api.post<Session>(`/sessions/${id}/close`);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/sessions/${id}`);
  },
};
