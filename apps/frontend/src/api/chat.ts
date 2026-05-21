import { api } from './client';
import type { Message } from '@/types';

export const chatApi = {
  getMessages: async (sessionId: string): Promise<Message[]> => {
    const { data } = await api.get<Message[]>(`/sessions/${sessionId}/messages`);
    return data;
  },

  sendMessage: async (sessionId: string, content: string): Promise<{ userMessage: Message; assistantMessage: Message }> => {
    const { data } = await api.post(`/sessions/${sessionId}/messages`, { content });
    return data;
  },
};
