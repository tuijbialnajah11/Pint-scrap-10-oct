export type TagCategory = 'artist' | 'character' | 'copyright' | 'general' | 'meta';

export interface TagItem {
  name: string;
  category: TagCategory;
  count: number;
}

export type Rating = 'general' | 'sensitive' | 'questionable' | 'explicit';

export interface BooruPost {
  id: string;
  title: string;
  imageUrl: string;
  previewUrl: string;
  sourceUrl?: string;
  rating: Rating;
  score: number;
  views: number;
  width: number;
  height: number;
  fileSize: string;
  createdAt: string;
  palette: string[];
  tags: {
    artists: string[];
    characters: string[];
    copyrights: string[];
    general: string[];
    meta: string[];
  };
  allTags: string[];
}

export interface Pool {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  postIds: string[];
  createdAt: string;
}

export type ActiveTab = 'gallery' | 'tags' | 'favorites' | 'pools' | 'tg-bot';
