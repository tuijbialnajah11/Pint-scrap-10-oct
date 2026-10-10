import React from 'react';
import { ActiveTab } from '../types/booru';
import { Shield, ShieldAlert, Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  safeMode: boolean;
  setSafeMode: (safe: boolean) => void;
  onOpenUpload: () => void;
  onOpenAbout: () => void;
  favoriteCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  safeMode,
  setSafeMode,
  onOpenUpload,
  onOpenAbout,
  favoriteCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#080a0f]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element Brand Zone */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('gallery');
            }}
            className="text-xl font-bold tracking-tight text-white hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 font-display flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-tr from-sky-500 to-indigo-500 inline-block"></span>
            <span>BooruNexus</span>
          </a>

          {/* Zone 2: 4–5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'gallery' ? 'text-sky-400' : ''
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => setActiveTab('tg-bot')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'tg-bot' ? 'text-sky-400' : ''
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              <span>TG Bot APIs</span>
            </button>
            <button
              onClick={() => setActiveTab('tags')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'tags' ? 'text-sky-400' : ''
              }`}
            >
              Tag Directory
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'favorites' ? 'text-sky-400' : ''
              }`}
            >
              <span>Favorites</span>
              {favoriteCount > 0 && (
                <span className="text-xs text-slate-400 font-mono">({favoriteCount})</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('pools')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'pools' ? 'text-sky-400' : ''
              }`}
            >
              Pools
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Safe Mode Toggle Button */}
            <button
              onClick={() => setSafeMode(!safeMode)}
              title={safeMode ? 'Safe Mode Active (Click to toggle)' : 'Unrestricted Mode (Click to toggle)'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                safeMode
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/50'
                  : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/50'
              }`}
            >
              {safeMode ? (
                <>
                  <Shield className="w-3.5 h-3.5" />
                  <span>Safe Mode: ON</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Safe Mode: OFF</span>
                </>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Art</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
