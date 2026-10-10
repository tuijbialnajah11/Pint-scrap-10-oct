import React, { useState } from 'react';
import { BooruPost, Rating } from '../types/booru';
import { X, Upload, Sparkles, Image as ImageIcon } from 'lucide-react';

interface UploadModalProps {
  onClose: () => void;
  onAddPost: (post: Omit<BooruPost, 'id' | 'views' | 'createdAt'>) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ onClose, onAddPost }) => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [artists, setArtists] = useState('');
  const [characters, setCharacters] = useState('');
  const [copyrights, setCopyrights] = useState('');
  const [generalTags, setGeneralTags] = useState('');
  const [rating, setRating] = useState<Rating>('general');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [previewError, setPreviewError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const parseList = (str: string) =>
      str
        .split(/[, ]+/)
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

    const parsedArtists = parseList(artists);
    const parsedChars = parseList(characters);
    const parsedCopyrights = parseList(copyrights);
    const parsedGeneral = parseList(generalTags);

    const allTags = [
      ...parsedArtists,
      ...parsedChars,
      ...parsedCopyrights,
      ...parsedGeneral,
      'highres',
    ];

    onAddPost({
      title: title.trim(),
      imageUrl: imageUrl.trim(),
      previewUrl: imageUrl.trim(),
      rating,
      score: 1,
      width: Number(width) || 1920,
      height: Number(height) || 1080,
      fileSize: '2.5 MB',
      palette: ['#0f172a', '#3b82f6', '#ec4899', '#10b981', '#f59e0b'],
      tags: {
        artists: parsedArtists.length > 0 ? parsedArtists : ['original_artist'],
        characters: parsedChars,
        copyrights: parsedCopyrights.length > 0 ? parsedCopyrights : ['original'],
        general: parsedGeneral.length > 0 ? parsedGeneral : ['1girl', 'solo'],
        meta: ['highres', 'user_submission'],
      },
      allTags,
    });

    onClose();
  };

  const handleQuickSample = () => {
    setTitle('Ethereal Sakura Guardian');
    setImageUrl('/src/assets/images/sakura_swordswoman_art_1791610610436.jpg');
    setArtists('wlop, ask');
    setCharacters('raiden_shogun');
    setCopyrights('genshin_impact');
    setGeneralTags('katana, kimono, thunderstorm, cherry_blossoms, lightning');
    setWidth(2048);
    setHeight(2730);
    setPreviewError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f1422] border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white font-display">
              Submit &amp; Tag Artwork
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick preset trigger */}
          <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Want to test booru taxonomy tagging quickly?</span>
            <button
              type="button"
              onClick={handleQuickSample}
              className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Tag Matrix</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Artwork Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Moonlight Duel"
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Image URL / Path *</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewError(false);
                }}
                placeholder="https://... or /src/assets/..."
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          {/* Tag Taxonomy Fields */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-mono text-rose-400 mb-1">
                Artists (space or comma separated)
              </label>
              <input
                type="text"
                value={artists}
                onChange={(e) => setArtists(e.target.value)}
                placeholder="e.g. wlop, citemer, ask"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-emerald-400 mb-1">
                  Characters
                </label>
                <input
                  type="text"
                  value={characters}
                  onChange={(e) => setCharacters(e.target.value)}
                  placeholder="e.g. frieren, raiden_shogun, lucy"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-violet-400 mb-1">
                  Copyright / Series
                </label>
                <input
                  type="text"
                  value={copyrights}
                  onChange={(e) => setCopyrights(e.target.value)}
                  placeholder="e.g. genshin_impact, cyberpunk_edgerunners"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-sky-400 mb-1">
                General Tags
              </label>
              <input
                type="text"
                value={generalTags}
                onChange={(e) => setGeneralTags(e.target.value)}
                placeholder="e.g. 1girl, solo, katana, scenic, sunset, cyberpunk_city"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          {/* Rating & Dimensions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value as Rating)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="general">General (Safe)</option>
                <option value="sensitive">Sensitive</option>
                <option value="questionable">Questionable</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow transition-colors"
            >
              Add to Booru Archive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
