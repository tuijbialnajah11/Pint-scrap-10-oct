import { TagCategory } from '../types/booru';

export function getTagCategoryColor(category: TagCategory): {
  text: string;
  badge: string;
  border: string;
  hover: string;
} {
  switch (category) {
    case 'artist':
      return {
        text: 'text-rose-400',
        badge: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
        border: 'border-rose-500/30',
        hover: 'hover:text-rose-300'
      };
    case 'character':
      return {
        text: 'text-emerald-400',
        badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        border: 'border-emerald-500/30',
        hover: 'hover:text-emerald-300'
      };
    case 'copyright':
      return {
        text: 'text-violet-400',
        badge: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
        border: 'border-violet-500/30',
        hover: 'hover:text-violet-300'
      };
    case 'meta':
      return {
        text: 'text-amber-400',
        badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
        border: 'border-amber-500/30',
        hover: 'hover:text-amber-300'
      };
    case 'general':
    default:
      return {
        text: 'text-sky-400',
        badge: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
        border: 'border-sky-500/30',
        hover: 'hover:text-sky-300'
      };
  }
}

export function formatTagLabel(tag: string): string {
  return tag.replace(/_/g, ' ');
}
