import React, { useState, useEffect } from 'react';
import { Bot, Key, Power, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, Eye, EyeOff } from 'lucide-react';

interface BotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
}

export default function App() {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [botInfo, setBotInfo] = useState<BotInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check saved token / current status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/bot/status');
        if (res.ok) {
          const data = await res.json();
          if (data.connected && data.botInfo) {
            setBotInfo(data.botInfo);
          }
        }
      } catch {}
    };

    fetchStatus();
    const saved = localStorage.getItem('tg_saved_token');
    if (saved && !botInfo) {
      setToken(saved);
    }
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = token.trim();
    if (!cleanToken) {
      setError('Please enter your BotFather token');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/bot/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: cleanToken }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setBotInfo(data.botInfo);
        localStorage.setItem('tg_saved_token', cleanToken);
        setError(null);
      } else {
        setError(data.error || 'Invalid token or unauthorized.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to connect to Telegram.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await fetch('/api/bot/disconnect', { method: 'POST' });
    } catch {}
    setBotInfo(null);
    setToken('');
    localStorage.removeItem('tg_saved_token');
  };

  return (
    <main className="min-h-screen w-full bg-[#080a0f] text-slate-100 flex items-center justify-center p-4 selection:bg-sky-500 selection:text-white">
      <div className="w-full max-w-md">
        {!botInfo ? (
          /* Connect Form */
          <div className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="space-y-1.5 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-3">
                <Bot className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-white font-display">
                Pinterest Telegram Bot
              </h1>
              <p className="text-xs text-slate-400">
                Enter your BotFather token to start the bot
              </p>
            </div>

            <form onSubmit={handleConnect} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">
                  BotFather Token
                </label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={token}
                    onChange={(e) => {
                      setToken(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="123456789:ABCdefGhIJKlmNoPQRsTUV..."
                    disabled={loading}
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full pl-3.5 pr-10 py-3 bg-slate-950 border border-slate-700/80 rounded-xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-mono text-sm tracking-wide"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                    title={showToken ? 'Hide token' : 'Show token'}
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-rose-300 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !token.trim()}
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium rounded-xl text-sm transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4" />
                    <span>Start Bot</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Connected State */
          <div className="bg-[#0f1422] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white truncate">
                    {botInfo.first_name}
                  </h2>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                </div>
                <p className="text-xs font-mono text-sky-400 truncate">
                  @{botInfo.username}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-900 space-y-1.5 text-xs font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-emerald-400">Online &amp; Scraping</span>
              </div>
              <div className="flex justify-between">
                <span>Bot ID:</span>
                <span className="text-slate-300">{botInfo.id}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <a
                href={`https://t.me/${botInfo.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow"
              >
                <span>Open in Telegram</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={handleDisconnect}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium rounded-xl text-xs transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
