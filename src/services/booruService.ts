import { BooruPost, Pool, TagItem, Rating } from '../types/booru';
import { INITIAL_POSTS, INITIAL_POOLS, TOP_TAG_ENCYCLOPEDIA } from '../data/initialPosts';

const POSTS_KEY = 'booru_nexus_posts';
const FAVORITES_KEY = 'booru_nexus_favorites';
const POOLS_KEY = 'booru_nexus_pools';
const VOTED_KEY = 'booru_nexus_voted_posts';

export class BooruService {
  static getPosts(): BooruPost[] {
    try {
      const stored = localStorage.getItem(POSTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_POSTS;
  }

  static savePosts(posts: BooruPost[]): void {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }

  static getFavorites(): string[] {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return ['post-1001', 'post-1002'];
  }

  static toggleFavorite(postId: string): string[] {
    const current = this.getFavorites();
    const updated = current.includes(postId)
      ? current.filter(id => id !== postId)
      : [...current, postId];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    return updated;
  }

  static isFavorite(postId: string): boolean {
    return this.getFavorites().includes(postId);
  }

  static getPools(): Pool[] {
    try {
      const stored = localStorage.getItem(POOLS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_POOLS;
  }

  static savePools(pools: Pool[]): void {
    localStorage.setItem(POOLS_KEY, JSON.stringify(pools));
  }

  static createPool(title: string, description: string, initialPostId?: string): Pool {
    const pools = this.getPools();
    const newPool: Pool = {
      id: `pool-${Date.now()}`,
      title,
      description,
      coverImage: initialPostId 
        ? (this.getPosts().find(p => p.id === initialPostId)?.imageUrl || INITIAL_POSTS[0].imageUrl)
        : INITIAL_POSTS[0].imageUrl,
      postIds: initialPostId ? [initialPostId] : [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newPool, ...pools];
    this.savePools(updated);
    return newPool;
  }

  static togglePostInPool(poolId: string, postId: string): Pool[] {
    const pools = this.getPools();
    const updated = pools.map(pool => {
      if (pool.id === poolId) {
        const exists = pool.postIds.includes(postId);
        return {
          ...pool,
          postIds: exists ? pool.postIds.filter(id => id !== postId) : [...pool.postIds, postId]
        };
      }
      return pool;
    });
    this.savePools(updated);
    return updated;
  }

  static getUpvotedIds(): string[] {
    try {
      const stored = localStorage.getItem(VOTED_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [];
  }

  static votePost(postId: string, delta: number): { newScore: number; hasUpvoted: boolean } {
    const votedIds = this.getUpvotedIds();
    const alreadyVoted = votedIds.includes(postId);
    const posts = this.getPosts();
    let newScore = 0;
    let willBeVoted = false;

    const updated = posts.map(post => {
      if (post.id === postId) {
        if (delta > 0) {
          if (alreadyVoted) {
            // Cancel upvote
            post.score -= 1;
            willBeVoted = false;
          } else {
            post.score += 1;
            willBeVoted = true;
          }
        } else {
          post.score = Math.max(0, post.score - 1);
          willBeVoted = false;
        }
        newScore = post.score;
      }
      return post;
    });

    this.savePosts(updated);
    const newVotedList = willBeVoted 
      ? [...votedIds, postId]
      : votedIds.filter(id => id !== postId);
    localStorage.setItem(VOTED_KEY, JSON.stringify(newVotedList));

    return { newScore, hasUpvoted: willBeVoted };
  }

  static addPost(post: Omit<BooruPost, 'id' | 'views' | 'createdAt'>): BooruPost {
    const posts = this.getPosts();
    const newPost: BooruPost = {
      ...post,
      id: `post-${Date.now()}`,
      views: 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [newPost, ...posts];
    this.savePosts(updated);
    return newPost;
  }

  static parseSearchQuery(queryStr: string): {
    positiveTags: string[];
    negativeTags: string[];
    ratingFilter?: Rating;
    minScore?: number;
  } {
    const tokens = queryStr.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const positiveTags: string[] = [];
    const negativeTags: string[] = [];
    let ratingFilter: Rating | undefined = undefined;
    let minScore: number | undefined = undefined;

    for (const token of tokens) {
      if (token.startsWith('rating:')) {
        const val = token.replace('rating:', '') as Rating;
        if (['general', 'sensitive', 'questionable', 'explicit'].includes(val)) {
          ratingFilter = val;
        }
      } else if (token.startsWith('score:>') || token.startsWith('score:>=')) {
        const num = parseInt(token.replace(/^score:>=?/, ''), 10);
        if (!isNaN(num)) minScore = num;
      } else if (token.startsWith('-') && token.length > 1) {
        negativeTags.push(token.substring(1));
      } else {
        positiveTags.push(token);
      }
    }

    return { positiveTags, negativeTags, ratingFilter, minScore };
  }

  static filterPosts(
    posts: BooruPost[],
    query: string,
    safeMode: boolean,
    ratingTab: 'all' | 'general' | 'sensitive' | 'questionable',
    sortBy: 'score_desc' | 'date_desc' | 'views_desc' | 'random'
  ): BooruPost[] {
    const { positiveTags, negativeTags, ratingFilter, minScore } = this.parseSearchQuery(query);

    let filtered = posts.filter(post => {
      // Safe mode filter: only general rating allowed if safeMode is ON
      if (safeMode && post.rating !== 'general') {
        return false;
      }

      // Explicit rating tab filter
      if (ratingTab !== 'all' && post.rating !== ratingTab) {
        return false;
      }

      // In-query rating filter
      if (ratingFilter && post.rating !== ratingFilter) {
        return false;
      }

      // In-query min score
      if (minScore !== undefined && post.score < minScore) {
        return false;
      }

      const allTagsLower = post.allTags.map(t => t.toLowerCase());

      // Check negative tags (must NOT contain any negative tag)
      for (const neg of negativeTags) {
        if (allTagsLower.some(t => t.includes(neg))) {
          return false;
        }
      }

      // Check positive tags (must match all positive tags)
      for (const pos of positiveTags) {
        const matchesTag = allTagsLower.some(t => t.includes(pos));
        const matchesTitle = post.title.toLowerCase().includes(pos);
        if (!matchesTag && !matchesTitle) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    switch (sortBy) {
      case 'score_desc':
        filtered.sort((a, b) => b.score - a.score);
        break;
      case 'date_desc':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'views_desc':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'random':
        filtered.sort(() => Math.random() - 0.5);
        break;
    }

    return filtered;
  }

  static getAutocompleteSuggestions(prefix: string): TagItem[] {
    const clean = prefix.trim().toLowerCase();
    if (!clean) return [];

    const posts = this.getPosts();
    // Build frequency map from current posts
    const tagCountMap = new Map<string, { count: number; category: TagItem['category'] }>();

    // Seed from encyclopedia
    TOP_TAG_ENCYCLOPEDIA.forEach(item => {
      tagCountMap.set(item.name.toLowerCase(), { count: item.count, category: item.category });
    });

    // Add tags from actual posts
    posts.forEach(post => {
      post.tags.artists.forEach(t => {
        const key = t.toLowerCase();
        const prev = tagCountMap.get(key);
        tagCountMap.set(key, { count: (prev?.count || 10) + 1, category: 'artist' });
      });
      post.tags.characters.forEach(t => {
        const key = t.toLowerCase();
        const prev = tagCountMap.get(key);
        tagCountMap.set(key, { count: (prev?.count || 10) + 1, category: 'character' });
      });
      post.tags.copyrights.forEach(t => {
        const key = t.toLowerCase();
        const prev = tagCountMap.get(key);
        tagCountMap.set(key, { count: (prev?.count || 10) + 1, category: 'copyright' });
      });
      post.tags.general.forEach(t => {
        const key = t.toLowerCase();
        const prev = tagCountMap.get(key);
        tagCountMap.set(key, { count: (prev?.count || 10) + 1, category: 'general' });
      });
      post.tags.meta.forEach(t => {
        const key = t.toLowerCase();
        const prev = tagCountMap.get(key);
        tagCountMap.set(key, { count: (prev?.count || 10) + 1, category: 'meta' });
      });
    });

    const results: TagItem[] = [];
    tagCountMap.forEach((meta, name) => {
      if (name.includes(clean)) {
        results.push({
          name,
          category: meta.category,
          count: meta.count
        });
      }
    });

    // Sort: startsWith first, then by count descending
    return results
      .sort((a, b) => {
        const aStarts = a.name.startsWith(clean);
        const bStarts = b.name.startsWith(clean);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return b.count - a.count;
      })
      .slice(0, 8);
  }
}
