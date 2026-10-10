import React, { useState } from 'react';
import { BooruPost } from '../types/booru';
import { Heart, Maximize2, Image as ImageIcon } from 'lucide-react';
import { getTagCategoryColor, formatTagLabel } from '../utils/tagColors';

interface PostCardProps {
  post: BooruPost;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectPost: (post: BooruPost) => void;
  onTagClick: (tag: string) => void;
  safeMode: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  isFavorite,
  onToggleFavorite,
  onSelectPost,
  onTagClick,
  safeMode,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const primaryArtist = post.tags.artists[0] || 'Unknown';
  const primaryChar = post.tags.characters[0];
  const primaryCopyright = post.tags.copyrights[0];

  const isSensitive = post.rating !== 'general';

  return (
    <div className="group relative bg-[#0f1422] border border-slate-800/80 rounded-xl overflow-hidden shadow-md hover:border-slate-700 hover:shadow-xl transition-all duration-200 flex flex-col">
      {/* Media Container */}
      <div
        className="relative w-full aspect-[3/4] bg-slate-900 cursor-pointer overflow-hidden"
        onClick={() => onSelectPost(post)}
      >
        {/* Placeholder skeleton before load */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-slate-700" />
          </div>
        )}

        {/* Fallback container if broken */}
        {imageError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-indigo-950/40 p-4 flex flex-col items-center justify-center text-center">
            <ImageIcon className="w-8 h-8 text-slate-600 mb-2" />
            <p className="text-xs text-slate-400 font-mono">{post.title}</p>
            <span className="text-[11px] text-slate-400 mt-1">{post.width}×{post.height}</span>
          </div>
        ) : (
          <img
            src={post.previewUrl || post.imageUrl}
            alt={post.title}
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              isSensitive && safeMode ? 'blur-xl scale-110' : ''
            }`}
          />
        )}

        {/* Dark contrast scrim gradient for hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

        {/* Quick action buttons floating on top-right */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(post.id);
            }}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
              isFavorite
                ? 'bg-rose-500/90 text-white hover:bg-rose-600'
                : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/80'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => onSelectPost(post)}
            title="Inspect post details"
            className="p-2 rounded-lg bg-black/60 text-slate-300 hover:text-white hover:bg-black/80 backdrop-blur-md transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hover preview info at bottom */}
        <div className="absolute bottom-0 inset-x-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
          <p className="text-xs font-semibold text-white truncate drop-shadow-md">
            {post.title}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-300 mt-1 font-mono">
            <span>{post.width}×{post.height}</span>
            <span aria-hidden="true">·</span>
            <span>★ {post.score}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{post.rating}</span>
          </div>
        </div>
      </div>

      {/* Card Content & Zero-Pill Metadata */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5 bg-[#0f1422]">
        {/* Title */}
        <button
          onClick={() => onSelectPost(post)}
          className="text-left text-sm font-semibold text-slate-200 hover:text-sky-400 transition-colors line-clamp-1"
        >
          {post.title}
        </button>

        {/* Unboxed Metadata Line with typographic separators (Strict zero-pill rule) */}
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <button
            onClick={() => onTagClick(primaryArtist)}
            className="text-rose-400 hover:underline hover:text-rose-300 truncate max-w-[110px]"
            title={`Artist: ${primaryArtist}`}
          >
            {primaryArtist}
          </button>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">★ {post.score}</span>
          <span aria-hidden="true">·</span>
          <span>{post.fileSize}</span>
        </div>

        {/* Taxonomy Tags preview (Clickable text links) */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1 border-t border-slate-800/80 text-[11px] font-mono">
          {primaryCopyright && (
            <button
              onClick={() => onTagClick(primaryCopyright)}
              className="text-violet-400 hover:underline hover:text-violet-300 truncate max-w-[140px]"
            >
              {formatTagLabel(primaryCopyright)}
            </button>
          )}
          {primaryChar && (
            <>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <button
                onClick={() => onTagClick(primaryChar)}
                className="text-emerald-400 hover:underline hover:text-emerald-300 truncate max-w-[130px]"
              >
                {formatTagLabel(primaryChar)}
              </button>
            </>
          )}
          {post.tags.general.slice(0, 2).map((gt) => (
            <React.Fragment key={gt}>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <button
                onClick={() => onTagClick(gt)}
                className="text-slate-400 hover:underline hover:text-slate-300 truncate"
              >
                {formatTagLabel(gt)}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
