import { api } from './client';
import type { Agent } from '@/types';

export const agentsApi = {
  getAll: async (): Promise<Agent[]> => {
    const { data } = await api.get<Agent[]>('/agents');
    return data;
  },

  getOne: async (id: string): Promise<Agent> => {
    const { data } = await api.get<Agent>(`/agents/${id}`);
    return data;
  },

  create: async (agent: Partial<Agent>): Promise<Agent> => {
    const { data } = await api.post<Agent>('/agents', agent);
    return data;
  },

  update: async (id: string, updates: Partial<Agent>): Promise<Agent> => {
    const { data} = await api.patch<Agent>(`/agents/${id}`, updates);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/agents/${id}`);
  },
};
