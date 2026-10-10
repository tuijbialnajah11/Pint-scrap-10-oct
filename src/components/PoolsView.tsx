import React, { useState } from 'react';
import { Pool, BooruPost } from '../types/booru';
import { Layers, Plus, Image as ImageIcon, ChevronRight, ArrowLeft } from 'lucide-react';
import { PostCard } from './PostCard';

interface PoolsViewProps {
  pools: Pool[];
  posts: BooruPost[];
  onCreatePool: (title: string, desc: string) => void;
  onSelectPost: (post: BooruPost) => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  onTagClick: (tag: string) => void;
  safeMode: boolean;
}

export const PoolsView: React.FC<PoolsViewProps> = ({
  pools,
  posts,
  onCreatePool,
  onSelectPost,
  onToggleFavorite,
  isFavorite,
  onTagClick,
  safeMode,
}) => {
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const selectedPool = pools.find((p) => p.id === selectedPoolId);
  const poolPosts = selectedPool
    ? posts.filter((p) => selectedPool.postIds.includes(p.id))
    : [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreatePool(newTitle.trim(), newDesc.trim());
    setNewTitle('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  if (selectedPool) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <button
          onClick={() => setSelectedPoolId(null)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Pools</span>
        </button>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 bg-[#0f1422] border border-slate-800 rounded-2xl">
          <div>
            <span className="text-xs font-mono text-sky-400">Pool Collection</span>
            <h1 className="text-2xl font-bold text-white font-display mt-0.5">{selectedPool.title}</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">{selectedPool.description}</p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            <span>{poolPosts.length} artworks in pool</span>
            <span aria-hidden="true"> · </span>
            <span>Created {selectedPool.createdAt}</span>
          </div>
        </div>

        {poolPosts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800/80">
            <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No artworks in this pool yet</h3>
            <p className="text-xs text-slate-400 mt-1">Open any artwork in the gallery and click "Pool" to add it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {poolPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isFavorite={isFavorite(post.id)}
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
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display flex items-center gap-2">
            <Layers className="w-6 h-6 text-sky-400" />
            <span>Booru Pools &amp; Series</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Thematic archives, manga doujin series, and artist anthology sets.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Pool</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pools.map((pool) => (
          <div
            key={pool.id}
            onClick={() => setSelectedPoolId(pool.id)}
            className="group cursor-pointer bg-[#0f1422] border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-xl transition-all flex flex-col"
          >
            <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
              <img
                src={pool.coverImage}
                alt={pool.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white">
                <span className="font-semibold">{pool.postIds.length} items</span>
                <span className="text-slate-300">{pool.createdAt}</span>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-sky-400 transition-colors">
                  {pool.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {pool.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-sky-400">
                <span>Browse Pool</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for creating a new pool */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f1422] border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold text-white font-display">Create Thematic Pool</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Pool Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Cyberpunk Nightscapes"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief summary of what artworks belong in this pool..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold"
                >
                  Create Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
