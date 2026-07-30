'use client';

import React, { useState } from 'react';
import { useWebSocket, ConnectionStatus } from '@/frontend/hooks/useWebSocket';

export default function WebSocketTestPage() {
  const {
    status,
    messages,
    clientId,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
  } = useWebSocket();

  const [inputMessage, setInputMessage] = useState('');
  const [customType, setCustomType] = useState('chat');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(customType, inputMessage.trim());
    setInputMessage('');
  };

  const handlePing = () => {
    sendMessage('ping');
  };

  const getStatusBadge = (st: ConnectionStatus) => {
    switch (st) {
      case 'connected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2.5 h-2.5 mr-2 rounded-full bg-emerald-500 animate-pulse" />
            Connected
          </span>
        );
      case 'connecting':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-2.5 h-2.5 mr-2 rounded-full bg-amber-500 animate-ping" />
            Connecting...
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-2.5 h-2.5 mr-2 rounded-full bg-rose-500" />
            Error
          </span>
        );
      case 'disconnected':
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <span className="w-2.5 h-2.5 mr-2 rounded-full bg-slate-500" />
            Disconnected
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              WebSocket Real-Time Tester
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Test and verify real-time WebSocket messaging with the backend server.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(status)}
            {status === 'connected' ? (
              <button
                onClick={disconnect}
                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition border border-slate-700"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={connect}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition shadow-lg shadow-indigo-600/20"
              >
                Connect
              </button>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-[#121827] grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Client ID</div>
            <div className="text-lg font-mono font-medium text-indigo-300 mt-1 truncate">
              {clientId || 'Not Assigned'}
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">WS Endpoint</div>
            <div className="text-lg font-mono font-medium text-blue-300 mt-1">
              ws://localhost:3001
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Messages</div>
            <div className="text-lg font-mono font-medium text-emerald-300 mt-1">
              {messages.length}
            </div>
          </div>
        </div>

        {/* Message Actions */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-200">Send Test Message</h2>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="Event Type (e.g. chat, ping)"
                className="w-full md:w-48 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type message content..."
                disabled={status !== 'connected'}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status !== 'connected' || !inputMessage.trim()}
                className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20"
              >
                Send Message
              </button>
            </div>
          </form>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handlePing}
              disabled={status !== 'connected'}
              className="px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-950/60 border border-indigo-800/50 hover:bg-indigo-900/60 rounded-md transition disabled:opacity-50"
            >
              Send Ping Event
            </button>
            <button
              onClick={clearMessages}
              disabled={messages.length === 0}
              className="px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-md transition disabled:opacity-50"
            >
              Clear Feed
            </button>
          </div>
        </div>

        {/* Live Feed */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-200">Live Message Stream</h2>
            <span className="text-xs text-slate-500">Real-time updates</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 h-80 overflow-y-auto font-mono text-xs space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600 italic">
                No messages received yet. Connect and send a message!
              </div>
            ) : (
              messages.map((msg, index) => {
                const isSystem = msg.type === 'system' || msg.type === 'welcome';
                const isSelf = msg.sender === clientId;

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      isSystem
                        ? 'bg-blue-950/20 border-blue-900/30 text-blue-300'
                        : isSelf
                        ? 'bg-indigo-950/30 border-indigo-800/40 text-indigo-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] opacity-75 mb-1">
                      <span className="font-bold uppercase tracking-wider text-indigo-400">
                        [{msg.type}] {msg.sender || 'Anonymous'}
                      </span>
                      <span>{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}</span>
                    </div>
                    <div className="text-sm font-sans break-words">{msg.content || JSON.stringify(msg)}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
