export interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  config: {
    model: string;
    temperature: number;
    systemPrompt: string;
    maxTokens?: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  _id: string;
  agent: Agent;
  user: string;
  status: 'active' | 'closed' | 'archived';
  title?: string;
  metadata?: Record<string, any>;
  messageCount: number;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  session: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
  tokens?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}
