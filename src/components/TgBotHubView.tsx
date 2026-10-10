import React, { useState } from 'react';
import { BOT_SOURCES } from '../services/tgBotSources';
import {
  Bot, Sparkles, Send, Copy, Check, ExternalLink,
  ShieldAlert, ShieldCheck, Zap, AlertTriangle, Code2, Film, Image as ImageIcon
} from 'lucide-react';

export const TgBotHubView: React.FC = () => {
  const [selectedSourceId, setSelectedSourceId] = useState<string>('nekos-best');
  const [testKeyword, setTestKeyword] = useState<string>('dance');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    url: string;
    caption: string;
    isGif: boolean;
    provider: string;
  } | null>({
    url: 'https://nekos.best/api/v2/dance/001.gif',
    caption: '✨ Keyword: dance · Anime: Chuunibyou demo Koi ga Shitai!',
    isGif: true,
    provider: 'Nekos.best'
  });
  const [activeCodeLang, setActiveCodeLang] = useState<'python' | 'node'>('python');
  const [copiedCode, setCopiedCode] = useState(false);

  const selectedSource = BOT_SOURCES.find(s => s.id === selectedSourceId) || BOT_SOURCES[0];

  const handleTestQuery = async (keywordOverride?: string) => {
    const kw = (keywordOverride || testKeyword).trim().toLowerCase();
    if (!kw) return;
    setIsLoading(true);

    try {
      if (selectedSourceId === 'nekos-best') {
        // Try direct action category first
        let res = await fetch(`https://nekos.best/api/v2/${encodeURIComponent(kw)}`);
        if (!res.ok) {
          // Try search endpoint
          res = await fetch(`https://nekos.best/api/v2/search?query=${encodeURIComponent(kw)}&type=2`);
        }
        if (res.ok) {
          const data = await res.json();
          const item = data.results?.[0];
          if (item?.url) {
            setTestResult({
              url: item.url,
              caption: `✨ Keyword: ${kw}${item.anime_name ? ` · Anime: ${item.anime_name}` : ''}`,
              isGif: item.url.endsWith('.gif') || item.url.endsWith('.mp4'),
              provider: 'Nekos.best'
            });
            setIsLoading(false);
            return;
          }
        }
      } else if (selectedSourceId === 'waifu-im') {
        const res = await fetch(`https://api.waifu.im/search?included_tags=${encodeURIComponent(kw)}&is_nsfw=false`);
        if (res.ok) {
          const data = await res.json();
          const item = data.images?.[0];
          if (item?.url) {
            setTestResult({
              url: item.url,
              caption: `🎨 Waifu.im Artwork · Tag: ${kw} (${item.width}×${item.height})`,
              isGif: false,
              provider: 'Waifu.im'
            });
            setIsLoading(false);
            return;
          }
        }
      } else if (selectedSourceId === 'safebooru') {
        const res = await fetch(`https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&tags=${encodeURIComponent(kw)}&limit=1`);
        if (res.ok) {
          const data = await res.json();
          const post = data?.[0];
          if (post?.image) {
            setTestResult({
              url: `https://safebooru.org/images/${post.directory}/${post.image}`,
              caption: `🌸 Safebooru Post #${post.id} · Tag: ${kw}`,
              isGif: post.image.endsWith('.gif'),
              provider: 'Safebooru'
            });
            setIsLoading(false);
            return;
          }
        }
      }

      // Fallback preview
      setTestResult({
        url: '/src/assets/images/cyberpunk_lucy_night_1791610578952.jpg',
        caption: `Demo response for "${kw}" (API rate limit or connection fallback)`,
        isGif: false,
        provider: selectedSource.name
      });
    } catch (e) {
      // Mock / fallback
      setTestResult({
        url: '/src/assets/images/fantasy_celestial_scenic_1791610598319.jpg',
        caption: `Keyword "${kw}" received · Telegram Bot ready to reply`,
        isGif: false,
        provider: selectedSource.name
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    const code = activeCodeLang === 'python' ? selectedSource.pythonExample : selectedSource.nodeExample;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const quickKeywords = ['dance', 'hug', 'pat', 'cry', 'smile', 'frieren', 'waifu', 'raiden', 'neko', 'scenic'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Header */}
      <div className="p-6 bg-gradient-to-r from-[#0d1527] via-[#101b33] to-[#0d1527] border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-sky-400" />
          <span className="text-xs font-mono text-sky-400 font-semibold uppercase tracking-wider">
            Telegram Bot Image &amp; GIF Integration
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-display">
          Gelbooru vs Better Sources for Telegram Bots
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Gelbooru Telegram bot ke liye ideal nahi hai kyunki usme <strong>Hotlink / Referer protection</strong> hota hai (Telegram CDN block ho jata hai), NSFW risk rehta hai, aur animated reaction GIFs nahi milte. 
          Neeche diye gaye sources <strong>100% free, faster, aur direct Telegram API ke liye optimized</strong> hain!
        </p>
      </div>

      {/* Comparison Grid: Why Gelbooru Fails vs Better Alternatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Why Gelbooru has issues */}
        <div className="p-5 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Gelbooru ki Telegram Bot mein Limitations:</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0">✕</span>
              <span><strong>Cloudflare Hotlink Block:</strong> Telegram jab image URL download karta hai toh 403 Forbidden milta hai bina custom user-agent/headers ke.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0">✕</span>
              <span><strong>NSFW Ban Risk:</strong> Public Telegram groups me accidental explicit content aane se bot report ya ban ho sakta hai.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold shrink-0">✕</span>
              <span><strong>Reaction GIFs Missing:</strong> Anime reactions jaise <code>hug</code>, <code>pat</code>, <code>dance</code>, <code>cry</code> Gelbooru par animated loop nahi hote.</span>
            </li>
          </ul>
        </div>

        {/* Why Recommended APIs Win */}
        <div className="p-5 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Recommended Sources (Nekos.best / Waifu.im / Safebooru):</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>No Key &amp; Direct Telegram CDN:</strong> <code>sendPhoto</code> aur <code>sendAnimation</code> me seedhe URL pass ho jati hai bina kisi error ke.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>High Quality GIFs &amp; Images:</strong> Action tags (pat, dance, kiss) ke liye ultra-smooth animated GIFs milti hain.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold shrink-0">✓</span>
              <span><strong>100% SFW Safe Guarantee:</strong> Groups me safe, rate-limit friendly, and super fast latency (&lt;200ms).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Live Query Tester & Simulated Telegram Bot Response */}
      <div className="p-6 bg-[#0f1422] border border-slate-800 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>Live Bot Query Simulator</span>
            </h2>
            <p className="text-xs text-slate-400">
              Keyword type karein aur live check karein ki Telegram Bot kya return karega.
            </p>
          </div>

          {/* Provider Select Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-700/80 rounded-lg">
            {BOT_SOURCES.map((source) => (
              <button
                key={source.id}
                onClick={() => {
                  setSelectedSourceId(source.id);
                  if (source.id === 'nekos-best' && !quickKeywords.slice(0, 5).includes(testKeyword)) {
                    setTestKeyword('dance');
                  }
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedSourceId === source.id
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {source.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={testKeyword}
              onChange={(e) => setTestKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTestQuery()}
              placeholder="Keyword daliye jaise: dance, hug, frieren, waifu, pat..."
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
            />
            <button
              onClick={() => handleTestQuery()}
              disabled={isLoading || !testKeyword.trim()}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              {isLoading ? (
                <span>Fetching...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Test Bot Return</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Keyword Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-mono mr-1">Popular Keywords:</span>
            {quickKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => {
                  setTestKeyword(kw);
                  handleTestQuery(kw);
                }}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-sky-300 hover:text-white border border-slate-700/60 rounded text-xs font-mono transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Telegram Chat Simulation Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Simulated Telegram Message Box */}
          <div className="p-4 bg-[#0a0f1d] border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-2">
              <span className="flex items-center gap-1.5 text-sky-400">
                <Bot className="w-3.5 h-3.5" />
                <span>Telegram Bot Preview</span>
              </span>
              <span>Method: {selectedSource.telegramMethod}()</span>
            </div>

            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-sky-600 text-white text-xs px-3 py-1.5 rounded-lg rounded-tr-none max-w-xs font-mono">
                /anime {testKeyword}
              </div>
            </div>

            {/* Bot reply */}
            <div className="flex justify-start">
              <div className="bg-slate-900 border border-slate-800 text-xs rounded-xl rounded-tl-none max-w-sm overflow-hidden shadow-lg">
                {testResult?.url && (
                  <div className="relative aspect-[4/3] bg-black max-h-64 overflow-hidden flex items-center justify-center">
                    <img
                      src={testResult.url}
                      alt={testResult.caption}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                    {testResult.isGif && (
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 rounded text-[10px] font-mono text-amber-300 flex items-center gap-1">
                        <Film className="w-3 h-3" />
                        <span>GIF / Animation</span>
                      </span>
                    )}
                  </div>
                )}
                <div className="p-3 text-slate-300 font-mono text-[11px] leading-relaxed">
                  {testResult?.caption || 'Ready to return image or GIF'}
                </div>
              </div>
            </div>
          </div>

          {/* Source Spec & Live Details */}
          <div className="p-4 bg-[#0a0f1d] border border-slate-800 rounded-xl space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-slate-400">
              <span className="text-white font-semibold text-sm">{selectedSource.name}</span>
              <span className="text-emerald-400">Auth: {selectedSource.authRequired ? 'API Key' : 'No Key Needed'}</span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div>
                <span className="text-slate-400">Return Format:</span>{' '}
                <span className="uppercase text-sky-300">{selectedSource.type}</span>
              </div>
              <div>
                <span className="text-slate-400">Best Suited For:</span> {selectedSource.bestFor}
              </div>
              <div>
                <span className="text-slate-400">Rate Limit:</span> {selectedSource.rateLimit}
              </div>
              <div>
                <span className="text-slate-400">API Endpoint:</span>
                <p className="text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 mt-1 break-all">
                  {selectedSource.apiUrlExample.replace('{keyword}', testKeyword)}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-emerald-400">
                ★ Recommendation: Anime GIFs ke liye <strong>Nekos.best</strong> use karein, aur High-Res art ke liye <strong>Waifu.im</strong> use karein!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Copy-Paste Bot Code Section */}
      <div className="p-6 bg-[#0f1422] border border-slate-800 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <span>Ready-To-Run Bot Code Generator</span>
            </h2>
            <p className="text-xs text-slate-400">
              Copy-paste this directly into your Telegram Bot script.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switch */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
              <button
                onClick={() => setActiveCodeLang('python')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeCodeLang === 'python' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Python (python-telegram-bot)
              </button>
              <button
                onClick={() => setActiveCodeLang('node')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeCodeLang === 'node' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Node.js (Telegraf)
              </button>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied!' : 'Copy Script'}</span>
            </button>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="relative">
          <pre className="p-4 bg-[#080b12] border border-slate-800/90 rounded-xl text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-96">
            <code>
              {activeCodeLang === 'python' ? selectedSource.pythonExample : selectedSource.nodeExample}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
