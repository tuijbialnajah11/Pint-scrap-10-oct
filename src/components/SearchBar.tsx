import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Shuffle, ArrowUpDown, HelpCircle } from 'lucide-react';
import { TagItem, Rating } from '../types/booru';
import { BooruService } from '../services/booruService';
import { getTagCategoryColor, formatTagLabel } from '../utils/tagColors';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  ratingTab: 'all' | 'general' | 'sensitive' | 'questionable';
  setRatingTab: (tab: 'all' | 'general' | 'sensitive' | 'questionable') => void;
  sortBy: 'score_desc' | 'date_desc' | 'views_desc' | 'random';
  setSortBy: (sort: 'score_desc' | 'date_desc' | 'views_desc' | 'random') => void;
  onRandomPost: () => void;
  onOpenSyntaxHelp: () => void;
  totalMatches: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  ratingTab,
  setRatingTab,
  sortBy,
  setSortBy,
  onRandomPost,
  onOpenSyntaxHelp,
  totalMatches,
}) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<TagItem[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [activeToken, setActiveToken] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Handle outside click to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // Find the word currently under cursor
    const words = val.split(/\s+/);
    const lastWord = words[words.length - 1] || '';
    const cleanWord = lastWord.startsWith('-') ? lastWord.substring(1) : lastWord;

    if (cleanWord.length >= 1) {
      setActiveToken(lastWord);
      const matches = BooruService.getAutocompleteSuggestions(cleanWord);
      setSuggestions(matches);
    } else {
      setActiveToken('');
      setSuggestions([]);
    }
  };

  const handleApplySuggestion = (tagName: string) => {
    const words = inputValue.split(/\s+/);
    const lastWord = words[words.length - 1] || '';
    const isNegative = lastWord.startsWith('-');

    words.pop(); // remove incomplete word
    const finalTag = isNegative ? `-${tagName}` : tagName;
    words.push(finalTag);

    const newQuery = words.filter(Boolean).join(' ') + ' ';
    setInputValue(newQuery);
    setSearchQuery(newQuery.trim());
    setSuggestions([]);
    setActiveToken('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchQuery(inputValue.trim());
      setSuggestions([]);
      setIsFocused(false);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setIsFocused(false);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
    setSuggestions([]);
  };

  const parsedTokens = searchQuery
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  const removeSingleTag = (tagToRemove: string) => {
    const remaining = parsedTokens.filter(t => t !== tagToRemove).join(' ');
    setSearchQuery(remaining);
    setInputValue(remaining);
  };

  return (
    <div className="w-full bg-[#0d121d] border-b border-slate-800/80 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Main Search Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Autocomplete Input Container */}
          <div ref={wrapperRef} className="relative flex-1">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search tags (e.g. frieren, cyberpunk_city, wlop, -rain, rating:general)..."
                className="w-full pl-10 pr-20 py-2.5 bg-slate-900 border border-slate-700/70 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-mono"
              />
              <div className="absolute right-2.5 flex items-center gap-1.5">
                {inputValue && (
                  <button
                    onClick={handleClear}
                    title="Clear search"
                    className="p-1 text-slate-400 hover:text-slate-200 transition-colors rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onOpenSyntaxHelp}
                  title="Booru Search Syntax Tips"
                  className="p-1 text-slate-400 hover:text-sky-400 transition-colors rounded"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Autocomplete Dropdown */}
            {isFocused && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0e1422] border border-slate-700/80 rounded-lg shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/80">
                <div className="px-3 py-1.5 text-[11px] text-slate-400 font-mono flex items-center justify-between bg-slate-900/60">
                  <span>Autocomplete matching "{activeToken}"</span>
                  <span>Tab or Click to apply</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {suggestions.map((item) => {
                    const style = getTagCategoryColor(item.category);
                    return (
                      <button
                        key={`${item.category}-${item.name}`}
                        type="button"
                        onClick={() => handleApplySuggestion(item.name)}
                        className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-slate-800/70 transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-medium ${style.text}`}>
                            {item.name}
                          </span>
                          <span className="text-[11px] text-slate-400 group-hover:text-slate-300">
                            {formatTagLabel(item.name)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                          <span className="capitalize text-[11px]">{item.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{item.count.toLocaleString()}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="pl-8 pr-7 py-2.5 bg-slate-900 border border-slate-700/70 rounded-lg text-xs font-medium text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer appearance-none"
              >
                <option value="score_desc">Score: Highest</option>
                <option value="date_desc">Date: Newest</option>
                <option value="views_desc">Views: Highest</option>
                <option value="random">Shuffle</option>
              </select>
            </div>

            {/* Random Pick Button */}
            <button
              onClick={onRandomPost}
              title="Roll a random artwork"
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700/70 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-400" />
              <span>Random Roll</span>
            </button>
          </div>
        </div>

        {/* Secondary Filter Bar: Segmented Rating Controls & Active Tokens */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Rating Segmented Control (Interactive Functional Buttons) */}
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-lg shrink-0">
            <span className="text-[11px] font-mono text-slate-400 px-2 uppercase tracking-wider">Rating:</span>
            <button
              onClick={() => setRatingTab('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                ratingTab === 'all'
                  ? 'bg-slate-700/90 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setRatingTab('general')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                ratingTab === 'general'
                  ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              General (SFW)
            </button>
            <button
              onClick={() => setRatingTab('sensitive')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                ratingTab === 'sensitive'
                  ? 'bg-amber-900/60 text-amber-200 border border-amber-700/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sensitive
            </button>
            <button
              onClick={() => setRatingTab('questionable')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                ratingTab === 'questionable'
                  ? 'bg-rose-900/60 text-rose-200 border border-rose-700/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Questionable
            </button>
          </div>

          {/* Matches & Active Query Breakdown */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="tabular-nums font-mono text-slate-300">
              {totalMatches} {totalMatches === 1 ? 'post' : 'posts'} found
            </span>
            {parsedTokens.length > 0 && (
              <button
                onClick={handleClear}
                className="text-sky-400 hover:text-sky-300 hover:underline transition-colors"
              >
                Reset query
              </button>
            )}
          </div>
        </div>

        {/* Active Token Chips (clickable to remove) */}
        {parsedTokens.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 font-mono mr-1">Active filters:</span>
            {parsedTokens.map((token) => {
              const isNeg = token.startsWith('-');
              return (
                <button
                  key={token}
                  onClick={() => removeSingleTag(token)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono transition-colors border ${
                    isNeg
                      ? 'bg-rose-950/40 text-rose-300 border-rose-800/60 hover:bg-rose-900/60'
                      : 'bg-slate-800 text-sky-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title="Click to remove tag"
                >
                  <span>{token}</span>
                  <X className="w-3 h-3 text-slate-400" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
