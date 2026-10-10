import React from 'react';
import { BooruPost } from '../types/booru';
import { PostCard } from './PostCard';
import { Heart, Download, Trash2, Image as ImageIcon } from 'lucide-react';

interface FavoritesViewProps {
  favoriteIds: string[];
  posts: BooruPost[];
  onSelectPost: (post: BooruPost) => void;
  onToggleFavorite: (id: string) => void;
  onTagClick: (tag: string) => void;
  safeMode: boolean;
  onClearFavorites: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteIds,
  posts,
  onSelectPost,
  onToggleFavorite,
  onTagClick,
  safeMode,
  onClearFavorites,
}) => {
  const favoritePosts = posts.filter((p) => favoriteIds.includes(p.id));

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(favoritePosts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `booru-favorites-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#0f1422] border border-slate-800 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              My Saved Favorites
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Personal bookmark archive saved in your browser storage.
          </p>
        </div>

        {favoritePosts.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onClearFavorites}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/60 rounded-lg text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {favoritePosts.length === 0 ? (
        <div className="p-16 text-center bg-slate-900/30 rounded-2xl border border-slate-800/80 flex flex-col items-center">
          <Heart className="w-12 h-12 text-slate-700 mb-4 stroke-1" />
          <h3 className="text-lg font-semibold text-slate-200">No favorites saved yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Click the heart icon on any post in the gallery to save it here for quick offline access.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {favoritePosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              onSelectPost={onSelectPost}
              onTagClick={onTagClick}
              safeMode={safeMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};
