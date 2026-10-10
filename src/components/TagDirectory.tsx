import React, { useState } from 'react';
import { TOP_TAG_ENCYCLOPEDIA } from '../data/initialPosts';
import { TagCategory } from '../types/booru';
import { getTagCategoryColor, formatTagLabel } from '../utils/tagColors';
import { Search, Tag, Sparkles } from 'lucide-react';

interface TagDirectoryProps {
  onSelectTag: (tag: string) => void;
}

export const TagDirectory: React.FC<TagDirectoryProps> = ({ onSelectTag }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | TagCategory>('all');

  const filteredTags = TOP_TAG_ENCYCLOPEDIA.filter((tag) => {
    const matchesCat = activeCategory === 'all' || tag.category === activeCategory;
    const matchesQuery =
      tag.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      tag.description.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Info */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-white font-display flex items-center gap-2">
          <Tag className="w-6 h-6 text-sky-400" />
          <span>Tag Directory &amp; Taxonomy Wiki</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          In booru imageboards like Gelbooru and Danbooru, every artwork is classified into standard semantic categories. Click any tag below to inspect matching illustrations.
        </p>
      </div>

      {/* Directory Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-lg border border-slate-800">
          {(['all', 'artist', 'copyright', 'character', 'general', 'meta'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                activeCategory === cat
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Tags' : cat}
            </button>
          ))}
        </div>

        {/* Quick Filter Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter tag names or notes..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-mono"
          />
        </div>
      </div>

      {/* Tag Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTags.map((tag) => {
          const style = getTagCategoryColor(tag.category);
          return (
            <div
              key={tag.name}
              className="p-4 bg-[#0f1422] border border-slate-800/80 rounded-xl hover:border-slate-700 transition-all flex flex-col justify-between gap-3 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <button
                    onClick={() => onSelectTag(tag.name)}
                    className={`text-sm font-mono font-bold ${style.text} hover:underline transition-colors text-left truncate`}
                  >
                    {tag.name}
                  </button>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">
                    {tag.count.toLocaleString()} posts
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {tag.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs font-mono">
                <span className="capitalize text-slate-400">{tag.category}</span>
                <button
                  onClick={() => onSelectTag(tag.name)}
                  className="text-sky-400 hover:text-sky-300 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Explore Art</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
