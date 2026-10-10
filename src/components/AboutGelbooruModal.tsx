import React from 'react';
import { X, Sparkles, BookOpen, Layers, Search, ShieldCheck } from 'lucide-react';

interface AboutGelbooruModalProps {
  onClose: () => void;
  onApplyQuery: (query: string) => void;
}

export const AboutGelbooruModal: React.FC<AboutGelbooruModalProps> = ({
  onClose,
  onApplyQuery,
}) => {
  const exampleQueries = [
    { label: 'Cyberpunk & Rain', query: 'cyberpunk_city rain' },
    { label: 'Frieren High-Res Fantasy', query: 'frieren scenic' },
    { label: 'WLOP Artwork', query: 'wlop katana' },
    { label: 'Exclude Rain Tag', query: '1girl -rain' },
    { label: 'Top Rated Artworks', query: 'rating:general score:>1000' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f1422] border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white font-display">
              Gelbooru &amp; The Booru Ecosystem
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            <strong className="text-white">Haan bilkul! Gelbooru</strong> internet ka sabse famous aur classic anime/manga imageboard platform hai jo mid-2000s mein shuru hua tha. Yeh Danbooru-style tag taxonomy engine par chalta hai aur digital anime art, manga illustrations, aur wallpapers ka vishal repository hai.
          </p>

          {/* Key Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono font-bold">
                <Layers className="w-4 h-4" />
                <span>5-Tier Tag Taxonomy</span>
              </div>
              <p className="text-xs text-slate-400">
                Artists (e.g. WLOP), Characters (Frieren), Copyrights (Genshin), General tags (Katana, Neon), aur Meta tags (Wallpaper, 4K).
              </p>
            </div>

            <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-bold">
                <Search className="w-4 h-4" />
                <span>Boolean &amp; Negation Search</span>
              </div>
              <p className="text-xs text-slate-400">
                Multiple tags ko space se combine karein, aur <code className="text-rose-300">-tag</code> se kisi specific element ko exclude karein.
              </p>
            </div>

            <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Safe Mode Architecture</span>
              </div>
              <p className="text-xs text-slate-400">
                Artworks are categorized into General (SFW), Sensitive, Questionable, aur Explicit ratings with one-click toggles.
              </p>
            </div>

            <div className="p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold">
                <BookOpen className="w-4 h-4" />
                <span>Pools &amp; Anthologies</span>
              </div>
              <p className="text-xs text-slate-400">
                Thematic collections aur serial artwork sets ko group karne ke liye custom image pools banaye jaate hain.
              </p>
            </div>
          </div>

          {/* Quick interactive search tester */}
          <div className="pt-2">
            <span className="text-xs font-mono text-slate-400 block mb-2">
              Try Booru Search Queries in BooruNexus:
            </span>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((ex) => (
                <button
                  key={ex.query}
                  onClick={() => {
                    onApplyQuery(ex.query);
                    onClose();
                  }}
                  className="px-2.5 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>{ex.label}</span>
                  <span className="text-[10px] text-slate-400">({ex.query})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Start Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
