import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Message } from '@/types';
import { useAuthStore } from '@/store/authStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

export const useWebSocket = (sessionId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token || !sessionId) return;

    // Create socket connection
    const socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      
      // Join session
      socket.emit('join_session', { sessionId });
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('error', (error: any) => {
      console.error('WebSocket error:', error);
    });

    // Message events
    socket.on('session_history', (history: Message[]) => {
      setMessages(history);
    });

    socket.on('new_message', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('typing', (data: { isTyping: boolean }) => {
      setIsTyping(data.isTyping);
    });

    return () => {
      if (sessionId) {
        socket.emit('leave_session', { sessionId });
      }
      socket.disconnect();
    };
  }, [token, sessionId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current || !sessionId) return;

      socketRef.current.emit('send_message', {
        sessionId,
        content,
      });
    },
    [sessionId]
  );

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!socketRef.current || !sessionId) return;

      socketRef.current.emit('typing', {
        sessionId,
        isTyping,
      });
    },
    [sessionId]
  );

  return {
    messages,
    isConnected,
    isTyping,
    sendMessage,
    sendTyping,
  };
};
