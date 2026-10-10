import React, { useState, useEffect, useRef } from 'react';
import { BooruPost, Pool } from '../types/booru';
import {
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw,
  Maximize, Heart, ThumbsUp, Download, Copy, Check,
  FolderPlus, Play, Pause, Sparkles, ExternalLink, Hash
} from 'lucide-react';
import { getTagCategoryColor, formatTagLabel } from '../utils/tagColors';
import { BooruService } from '../services/booruService';

interface PostModalProps {
  post: BooruPost;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  onTagClick: (tag: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  pools: Pool[];
  onToggleInPool: (poolId: string, postId: string) => void;
  onVote: (postId: string, delta: number) => void;
  hasUpvoted: boolean;
}

export const PostModal: React.FC<PostModalProps> = ({
  post,
  onClose,
  onPrev,
  onNext,
  hasNext,
  hasPrev,
  onTagClick,
  isFavorite,
  onToggleFavorite,
  pools,
  onToggleInPool,
  onVote,
  hasUpvoted,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [showPoolDropdown, setShowPoolDropdown] = useState(false);
  const [isSlideshow, setIsSlideshow] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'f' || e.key === 'F') onToggleFavorite(post.id);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext, isFavorite, post.id, onToggleFavorite]);

  // Slideshow timer
  useEffect(() => {
    let timer: any;
    if (isSlideshow) {
      timer = setInterval(() => {
        if (hasNext) {
          onNext();
        } else {
          setIsSlideshow(false);
        }
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isSlideshow, hasNext, onNext]);

  // Reset zoom & pan when post changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [post.id]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + post.imageUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col overflow-hidden animate-in fade-in duration-150">
      {/* Top Modal Toolbar */}
      <div className="h-14 px-4 bg-[#0a0d14]/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="text-xs font-mono text-slate-400 shrink-0">ID: {post.id}</span>
          <span aria-hidden="true" className="text-slate-700">·</span>
          <h2 className="text-sm font-semibold text-slate-200 truncate">{post.title}</h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Slideshow button */}
          <button
            onClick={() => setIsSlideshow(!isSlideshow)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isSlideshow
                ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            {isSlideshow ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isSlideshow ? 'Pause' : 'Slideshow'}</span>
          </button>

          {/* Copy direct link */}
          <button
            onClick={handleCopyLink}
            title="Copy image link"
            className="p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Download button */}
          <a
            href={post.imageUrl}
            download={`booru-${post.id}.jpg`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open/Download high-res file"
            className="p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Download className="w-4 h-4" />
          </a>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Split Body: Canvas on Left, Booru Tag Inspector on Right */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Artwork Canvas Area */}
        <div
          className="relative flex-1 bg-[#05070a] flex items-center justify-center overflow-hidden select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Artwork Image with Zoom and Pan */}
          <div
            className="transition-transform ease-out cursor-grab active:cursor-grabbing max-w-full max-h-full p-4 flex items-center justify-center"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            }}
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="max-h-[82vh] max-w-full object-contain rounded shadow-2xl pointer-events-auto"
              draggable={false}
            />
          </div>

          {/* Previous / Next Arrow Controls */}
          {hasPrev && (
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-sm border border-slate-800 transition-all shadow-lg"
              title="Previous post (Left arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {hasNext && (
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-sm border border-slate-800 transition-all shadow-lg"
              title="Next post (Right arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Floating Zoom Bar at Bottom of Canvas */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 bg-[#0e1422]/90 border border-slate-800 rounded-xl backdrop-blur-md shadow-xl text-xs font-mono text-slate-300">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="p-1 hover:text-white disabled:opacity-40 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="w-12 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="p-1 hover:text-white disabled:opacity-40 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <button
              onClick={handleZoomReset}
              className="p-1 hover:text-white transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Booru Tag Taxonomy Sidebar */}
        <div className="w-full lg:w-96 bg-[#0c101a] border-t lg:border-t-0 lg:border-l border-slate-800/90 flex flex-col h-auto lg:h-full overflow-y-auto">
          {/* Post Header Actions: Upvote, Favorite, Add to Pool */}
          <div className="p-4 border-b border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between gap-2">
              {/* Upvote button */}
              <button
                onClick={() => onVote(post.id, 1)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  hasUpvoted
                    ? 'bg-sky-950 text-sky-300 border-sky-700'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-current' : ''}`} />
                <span className="tabular-nums">★ {post.score} Score</span>
              </button>

              {/* Favorite button */}
              <button
                onClick={() => onToggleFavorite(post.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  isFavorite
                    ? 'bg-rose-950 text-rose-300 border-rose-700'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
              </button>

              {/* Pool Dropdown Trigger */}
              <div className="relative">
                <button
                  onClick={() => setShowPoolDropdown(!showPoolDropdown)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium transition-colors"
                  title="Add to a thematic collection pool"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pool</span>
                </button>

                {showPoolDropdown && (
                  <div className="absolute right-0 top-full mt-1.5 w-60 bg-[#121826] border border-slate-700 rounded-lg shadow-2xl p-2 z-50 divide-y divide-slate-800/80">
                    <p className="text-[11px] font-mono text-slate-400 px-2 py-1">Save to Pool</p>
                    <div className="py-1 space-y-1 max-h-48 overflow-y-auto">
                      {pools.map((p) => {
                        const inPool = p.postIds.includes(post.id);
                        return (
                          <button
                            key={p.id}
                            onClick={() => onToggleInPool(p.id, post.id)}
                            className="w-full text-left px-2 py-1.5 text-xs rounded hover:bg-slate-800 transition-colors flex items-center justify-between text-slate-200"
                          >
                            <span className="truncate">{p.title}</span>
                            {inPool && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Color Palette Extraction */}
            {post.palette && post.palette.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <span>Color Palette</span>
                  {copiedColor && <span className="text-emerald-400">Copied {copiedColor}!</span>}
                </div>
                <div className="flex items-center gap-1.5">
                  {post.palette.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleCopyColor(color)}
                      title={`Click to copy ${color}`}
                      className="flex-1 h-5 rounded hover:scale-110 transition-transform border border-slate-800 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Technical Specifications (Zero-Pill Metadata) */}
          <div className="p-4 border-b border-slate-800/80 space-y-2 text-xs font-mono">
            <h3 className="text-slate-400 text-[11px] uppercase tracking-wider">Specifications</h3>
            <div className="grid grid-cols-2 gap-2 text-slate-300">
              <div>
                <span className="text-slate-400">Resolution:</span> {post.width} × {post.height}
              </div>
              <div>
                <span className="text-slate-400">File Size:</span> {post.fileSize}
              </div>
              <div>
                <span className="text-slate-400">Rating:</span>{' '}
                <span className={`capitalize ${post.rating === 'general' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {post.rating}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Date:</span> {post.createdAt}
              </div>
            </div>
          </div>

          {/* Gelbooru Categorized Tag Tree */}
          <div className="p-4 space-y-4 flex-1">
            <h3 className="text-slate-400 text-[11px] font-mono uppercase tracking-wider">
              Booru Tag Taxonomy
            </h3>

            {/* 1. Artists */}
            {post.tags.artists.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-semibold text-rose-400">
                  Artists ({post.tags.artists.length})
                </span>
                <div className="space-y-1 pl-2">
                  {post.tags.artists.map((artist) => (
                    <div key={artist} className="flex items-center justify-between text-xs font-mono">
                      <button
                        onClick={() => {
                          onTagClick(artist);
                          onClose();
                        }}
                        className="text-rose-400 hover:text-rose-300 hover:underline transition-colors text-left"
                      >
                        {formatTagLabel(artist)}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Copyrights */}
            {post.tags.copyrights.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-semibold text-violet-400">
                  Copyrights ({post.tags.copyrights.length})
                </span>
                <div className="space-y-1 pl-2">
                  {post.tags.copyrights.map((cr) => (
                    <div key={cr} className="flex items-center justify-between text-xs font-mono">
                      <button
                        onClick={() => {
                          onTagClick(cr);
                          onClose();
                        }}
                        className="text-violet-400 hover:text-violet-300 hover:underline transition-colors text-left"
                      >
                        {formatTagLabel(cr)}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Characters */}
            {post.tags.characters.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-semibold text-emerald-400">
                  Characters ({post.tags.characters.length})
                </span>
                <div className="space-y-1 pl-2">
                  {post.tags.characters.map((char) => (
                    <div key={char} className="flex items-center justify-between text-xs font-mono">
                      <button
                        onClick={() => {
                          onTagClick(char);
                          onClose();
                        }}
                        className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors text-left"
                      >
                        {formatTagLabel(char)}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. General Tags */}
            {post.tags.general.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-semibold text-sky-400">
                  General Tags ({post.tags.general.length})
                </span>
                <div className="space-y-1 pl-2">
                  {post.tags.general.map((gt) => (
                    <div key={gt} className="flex items-center justify-between text-xs font-mono">
                      <button
                        onClick={() => {
                          onTagClick(gt);
                          onClose();
                        }}
                        className="text-sky-300 hover:text-white hover:underline transition-colors text-left"
                      >
                        {formatTagLabel(gt)}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Meta Tags */}
            {post.tags.meta.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono font-semibold text-amber-400">
                  Metadata ({post.tags.meta.length})
                </span>
                <div className="space-y-1 pl-2">
                  {post.tags.meta.map((mt) => (
                    <div key={mt} className="flex items-center justify-between text-xs font-mono">
                      <button
                        onClick={() => {
                          onTagClick(mt);
                          onClose();
                        }}
                        className="text-amber-400 hover:text-amber-300 hover:underline transition-colors text-left"
                      >
                        {formatTagLabel(mt)}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
