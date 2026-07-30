'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface WSMessage {
  type: string;
  sender?: string;
  content?: string;
  timestamp?: string;
  clientId?: string;
  [key: string]: unknown;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface UseWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001',
    autoConnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [messages, setMessages] = useState<WSMessage[]>([]);
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const connectRef = useRef<() => void>(() => {});

  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setStatus('connecting');

    try {
      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log('[useWebSocket] Connected to', url);
        setStatus('connected');
        reconnectCountRef.current = 0;
      };

      socket.onmessage = (event) => {
        try {
          const parsed: WSMessage = JSON.parse(event.data);

          if (parsed.type === 'welcome' && parsed.clientId) {
            setClientId(parsed.clientId);
          }

          setLastMessage(parsed);
          setMessages((prev) => [...prev, parsed]);
        } catch (err) {
          console.error('[useWebSocket] Error parsing message:', err);
          const rawMsg: WSMessage = {
            type: 'raw',
            content: event.data,
            timestamp: new Date().toISOString(),
          };
          setLastMessage(rawMsg);
          setMessages((prev) => [...prev, rawMsg]);
        }
      };

      socket.onerror = (event) => {
        console.error('[useWebSocket] Error:', event);
        setStatus('error');
      };

      socket.onclose = () => {
        console.log('[useWebSocket] Disconnected');
        setStatus('disconnected');
        socketRef.current = null;

        // Auto reconnect
        if (reconnectCountRef.current < maxReconnectAttempts) {
          reconnectCountRef.current += 1;
          console.log(`[useWebSocket] Reconnecting (${reconnectCountRef.current}/${maxReconnectAttempts})...`);
          reconnectTimerRef.current = setTimeout(() => {
            connectRef.current();
          }, reconnectInterval);
        }
      };
    } catch (err) {
      console.error('[useWebSocket] Connection attempt failed:', err);
      setStatus('error');
    }
  }, [url, maxReconnectAttempts, reconnectInterval]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }
    reconnectCountRef.current = maxReconnectAttempts; // Prevent auto-reconnect on manual disconnect
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    setStatus('disconnected');
  }, [maxReconnectAttempts]);

  const sendMessage = useCallback((type: string, content?: string, extraData?: Record<string, unknown>) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const payload: WSMessage = {
        type,
        content,
        timestamp: new Date().toISOString(),
        ...extraData,
      };
      socketRef.current.send(JSON.stringify(payload));
      return true;
    } else {
      console.warn('[useWebSocket] Cannot send message: socket is not connected');
      return false;
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [autoConnect, connect]);

  return {
    status,
    messages,
    lastMessage,
    clientId,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
  };
}
