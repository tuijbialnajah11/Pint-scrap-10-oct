import { BooruPost, Pool } from '../types/booru';

export const INITIAL_POSTS: BooruPost[] = [
  {
    id: 'post-1001',
    title: 'Neon Netrunner on Neo-Kyoto Skyline',
    imageUrl: '/src/assets/images/cyberpunk_lucy_night_1791610578952.jpg',
    previewUrl: '/src/assets/images/cyberpunk_lucy_night_1791610578952.jpg',
    sourceUrl: 'https://gelbooru.com/index.php?page=post&s=view&id=1001',
    rating: 'general',
    score: 1428,
    views: 18450,
    width: 2048,
    height: 2730,
    fileSize: '3.4 MB',
    createdAt: '2026-08-14',
    palette: ['#0a0b18', '#381c62', '#00e5ff', '#ff2a85', '#1a233a'],
    tags: {
      artists: ['citemer', 'wlop'],
      characters: ['lucy_(cyberpunk)'],
      copyrights: ['cyberpunk_edgerunners', 'cd_projekt_red', 'trigger'],
      general: ['1girl', 'solo', 'cyberpunk_city', 'neon_lights', 'rain', 'rooftop', 'futuristic_visor', 'hologram', 'cables', 'jacket', 'night_sky', 'highres'],
      meta: ['masterpiece', 'digital_art', 'original_composition', 'scenic']
    },
    allTags: ['citemer', 'wlop', 'lucy_(cyberpunk)', 'cyberpunk_edgerunners', 'cd_projekt_red', 'trigger', '1girl', 'solo', 'cyberpunk_city', 'neon_lights', 'rain', 'rooftop', 'futuristic_visor', 'hologram', 'cables', 'jacket', 'night_sky', 'highres', 'masterpiece', 'digital_art', 'original_composition', 'scenic']
  },
  {
    id: 'post-1002',
    title: 'Frieren at the Celestial World Tree of Old',
    imageUrl: '/src/assets/images/fantasy_celestial_scenic_1791610598319.jpg',
    previewUrl: '/src/assets/images/fantasy_celestial_scenic_1791610598319.jpg',
    sourceUrl: 'https://gelbooru.com/index.php?page=post&s=view&id=1002',
    rating: 'general',
    score: 2190,
    views: 31200,
    width: 3840,
    height: 2160,
    fileSize: '5.1 MB',
    createdAt: '2026-09-02',
    palette: ['#070d1a', '#173f63', '#4fc3f7', '#69f0ae', '#b388ff'],
    tags: {
      artists: ['tianliang_duohe', 'shinkai_makoto_style'],
      characters: ['frieren'],
      copyrights: ['sousou_no_frieren', 'madhouse'],
      general: ['1girl', 'solo', 'elf_ears', 'tree_of_life', 'scenic', 'starry_sky', 'ancient_ruins', 'magic_butterflies', 'staff', 'glowing_plants', 'milky_way', 'night'],
      meta: ['masterpiece', 'wallpaper', 'widescreen_4k', 'detailed_background']
    },
    allTags: ['tianliang_duohe', 'shinkai_makoto_style', 'frieren', 'sousou_no_frieren', 'madhouse', '1girl', 'solo', 'elf_ears', 'tree_of_life', 'scenic', 'starry_sky', 'ancient_ruins', 'magic_butterflies', 'staff', 'glowing_plants', 'milky_way', 'night', 'masterpiece', 'wallpaper', 'widescreen_4k', 'detailed_background']
  },
  {
    id: 'post-1003',
    title: 'Thunder Blade of the Narukami Ogosho',
    imageUrl: '/src/assets/images/sakura_swordswoman_art_1791610610436.jpg',
    previewUrl: '/src/assets/images/sakura_swordswoman_art_1791610610436.jpg',
    sourceUrl: 'https://gelbooru.com/index.php?page=post&s=view&id=1003',
    rating: 'general',
    score: 1856,
    views: 26400,
    width: 2048,
    height: 2730,
    fileSize: '4.2 MB',
    createdAt: '2026-07-29',
    palette: ['#120c1d', '#3b1754', '#7c3aed', '#f472b6', '#cbd5e1'],
    tags: {
      artists: ['wlop', 'ask'],
      characters: ['raiden_shogun', 'ei'],
      copyrights: ['genshin_impact', 'mihoyo', 'hoyoverse'],
      general: ['1girl', 'solo', 'katana', 'purple_kimono', 'samurai_armor', 'cherry_blossoms', 'thunderstorm', 'lightning', 'falling_petals', 'stone_path', 'rain'],
      meta: ['masterpiece', 'highres', 'sword', 'dramatic_lighting']
    },
    allTags: ['wlop', 'ask', 'raiden_shogun', 'ei', 'genshin_impact', 'mihoyo', 'hoyoverse', '1girl', 'solo', 'katana', 'purple_kimono', 'samurai_armor', 'cherry_blossoms', 'thunderstorm', 'lightning', 'falling_petals', 'stone_path', 'rain', 'masterpiece', 'highres', 'sword', 'dramatic_lighting']
  },
  {
    id: 'post-1004',
    title: 'Unit-03 Ready for Atmospheric Sortie',
    imageUrl: '/src/assets/images/mecha_scifi_hangar_1791610622970.jpg',
    previewUrl: '/src/assets/images/mecha_scifi_hangar_1791610622970.jpg',
    sourceUrl: 'https://gelbooru.com/index.php?page=post&s=view&id=1004',
    rating: 'general',
    score: 1204,
    views: 14900,
    width: 2560,
    height: 1920,
    fileSize: '3.8 MB',
    createdAt: '2026-06-18',
    palette: ['#111827', '#1e3a8a', '#eab308', '#38bdf8', '#475569'],
    tags: {
      artists: ['katoki_hajime', 'mika_pikazo'],
      characters: ['original_character'],
      copyrights: ['mecha_chronicles', 'original'],
      general: ['1girl', 'solo', 'mecha', 'robot', 'hangar', 'pilot_suit', 'helmet', 'caution_stripes', 'gantry', 'sci-fi', 'steam', 'giant_robot'],
      meta: ['masterpiece', 'highres', 'detailed_scenery', 'concept_art']
    },
    allTags: ['katoki_hajime', 'mika_pikazo', 'original_character', 'mecha_chronicles', 'original', '1girl', 'solo', 'mecha', 'robot', 'hangar', 'pilot_suit', 'helmet', 'caution_stripes', 'gantry', 'sci-fi', 'steam', 'giant_robot', 'masterpiece', 'highres', 'detailed_scenery', 'concept_art']
  },
  {
    id: 'post-1005',
    title: 'Cyber Diva in Holographic Stage Lights',
    imageUrl: '/src/assets/images/cyberpunk_lucy_night_1791610578952.jpg',
    previewUrl: '/src/assets/images/cyberpunk_lucy_night_1791610578952.jpg',
    sourceUrl: 'https://gelbooru.com/index.php?page=post&s=view&id=1005',
    rating: 'general',
    score: 980,
    views: 11200,
    width: 2048,
    height: 2730,
    fileSize: '3.2 MB',
    createdAt: '2026-05-12',
    palette: ['#0f172a', '#6366f1', '#ec4899', '#06b6d4', '#f8fafc'],
    tags: {
      artists: ['mika_pikazo'],
      characters: ['hatsune_miku'],
      copyrights: ['vocaloid', 'crypton_future_media'],
      general: ['1girl', 'solo', 'twintails', 'glowing_hair', 'cyberpunk_city', 'neon_lights', 'futuristic', 'headphones', 'night'],
      meta: ['highres', 'vibrant_colors']
    },
    allTags: ['mika_pikazo', 'hatsune_miku', 'vocaloid', 'crypton_future_media', '1girl', 'solo', 'twintails', 'glowing_hair', 'cyberpunk_city', 'neon_lights', 'futuristic', 'headphones', 'night', 'highres', 'vibrant_colors']
  },
  {
    id: 'post-1006',
    title: 'The Silent Sanctum of Inazuma',
    imageUrl: '/src/assets/images/sakura_swordswoman_art_1791610610436.jpg',
    previewUrl: '/src/assets/images/sakura_swordswoman_art_1791610610436.jpg',
    sourceUrl: 'https://gelbooru.com/index.php?page=post&s=view&id=1006',
    rating: 'general',
    score: 1642,
    views: 22100,
    width: 2048,
    height: 2730,
    fileSize: '4.1 MB',
    createdAt: '2026-08-01',
    palette: ['#1e1b4b', '#4c1d95', '#e11d48', '#fb7185', '#f1f5f9'],
    tags: {
      artists: ['ask'],
      characters: ['yae_miko', 'raiden_shogun'],
      copyrights: ['genshin_impact', 'hoyoverse'],
      general: ['1girl', 'solo', 'shrine_maiden', 'cherry_blossoms', 'pagoda', 'torii_gate', 'kimono', 'night', 'petals'],
      meta: ['masterpiece', 'highres', 'scenic']
    },
    allTags: ['ask', 'yae_miko', 'raiden_shogun', 'genshin_impact', 'hoyoverse', '1girl', 'solo', 'shrine_maiden', 'cherry_blossoms', 'pagoda', 'torii_gate', 'kimono', 'night', 'petals', 'masterpiece', 'highres', 'scenic']
  },
  {
    id: 'post-1007',
    title: 'Journey to Ende - Northern Highlands',
    imageUrl: '/src/assets/images/fantasy_celestial_scenic_1791610598319.jpg',
    previewUrl: '/src/assets/images/fantasy_celestial_scenic_1791610598319.jpg',
    sourceUrl: 'https://gelbooru.com/index.php?page=post&s=view&id=1007',
    rating: 'general',
    score: 1720,
    views: 20900,
    width: 3840,
    height: 2160,
    fileSize: '4.8 MB',
    createdAt: '2026-07-15',
    palette: ['#0b132b', '#1c2541', '#48cae4', '#90e0ef', '#caf0f8'],
    tags: {
      artists: ['tianliang_duohe'],
      characters: ['frieren', 'fern'],
      copyrights: ['sousou_no_frieren'],
      general: ['2girls', 'scenic', 'ruins', 'starry_sky', 'aurora', 'fantasy_landscape', 'glowing_tree', 'magic', 'night'],
      meta: ['wallpaper', '4k', 'official_art_style']
    },
    allTags: ['tianliang_duohe', 'frieren', 'fern', 'sousou_no_frieren', '2girls', 'scenic', 'ruins', 'starry_sky', 'aurora', 'fantasy_landscape', 'glowing_tree', 'magic', 'night', 'wallpaper', '4k', 'official_art_style']
  },
  {
    id: 'post-1008',
    title: 'Hangar Bay Maintenance Protocol 07',
    imageUrl: '/src/assets/images/mecha_scifi_hangar_1791610622970.jpg',
    previewUrl: '/src/assets/images/mecha_scifi_hangar_1791610622970.jpg',
    sourceUrl: 'https://gelbooru.com/index.php?page=post&s=view&id=1008',
    rating: 'general',
    score: 890,
    views: 9400,
    width: 2560,
    height: 1920,
    fileSize: '3.6 MB',
    createdAt: '2026-04-30',
    palette: ['#1e293b', '#0369a1', '#f59e0b', '#64748b', '#cbd5e1'],
    tags: {
      artists: ['katoki_hajime'],
      characters: ['original_character'],
      copyrights: ['original', 'mecha_chronicles'],
      general: ['mecha', 'hangar', 'pilot_suit', 'sci-fi', 'machinery', 'robot', 'crane', 'workplace'],
      meta: ['highres', 'scenery']
    },
    allTags: ['katoki_hajime', 'original_character', 'original', 'mecha_chronicles', 'mecha', 'hangar', 'pilot_suit', 'sci-fi', 'machinery', 'robot', 'crane', 'workplace', 'highres', 'scenery']
  }
];

export const INITIAL_POOLS: Pool[] = [
  {
    id: 'pool-cyber',
    title: 'Neo-Tokyo & Cyberpunk Aesthetics',
    description: 'High-density neon nightscapes, netrunners, holographic interfaces, and rain-soaked dystopian alleys.',
    coverImage: '/src/assets/images/cyberpunk_lucy_night_1791610578952.jpg',
    postIds: ['post-1001', 'post-1005'],
    createdAt: '2026-08-20'
  },
  {
    id: 'pool-fantasy',
    title: 'Celestial Lands & Magic Ruins',
    description: 'Ancient glowing trees, starry night skies, elven wanders, and peaceful fantasy chronicles.',
    coverImage: '/src/assets/images/fantasy_celestial_scenic_1791610598319.jpg',
    postIds: ['post-1002', 'post-1007'],
    createdAt: '2026-09-01'
  },
  {
    id: 'pool-warriors',
    title: 'Blades, Thunder & Cherry Blossoms',
    description: 'Traditional Japanese aesthetic infused with elemental electric lightning, katana duels, and falling sakura petals.',
    coverImage: '/src/assets/images/sakura_swordswoman_art_1791610610436.jpg',
    postIds: ['post-1003', 'post-1006'],
    createdAt: '2026-08-05'
  },
  {
    id: 'pool-mecha',
    title: 'Steel Giants & Orbital Hangar Bays',
    description: 'Industrial mecha designs, pilot gear, gantry cranes, and massive armored combat units.',
    coverImage: '/src/assets/images/mecha_scifi_hangar_1791610622970.jpg',
    postIds: ['post-1004', 'post-1008'],
    createdAt: '2026-07-10'
  }
];

export const TOP_TAG_ENCYCLOPEDIA = [
  // Artists
  { name: 'wlop', category: 'artist' as const, count: 18230, description: 'Famous digital painter known for cinematic lighting and GhostBlade series' },
  { name: 'citemer', category: 'artist' as const, count: 9410, description: 'Renowned illustrator known for cyberpunk cityscapes and edgy character designs' },
  { name: 'tianliang_duohe', category: 'artist' as const, count: 8750, description: 'Master of atmospheric celestial landscapes and Frieren illustrations' },
  { name: 'ask', category: 'artist' as const, count: 15420, description: 'Acclaimed illustrator celebrated for Fate, Genshin, and expressive eyes' },
  { name: 'mika_pikazo', category: 'artist' as const, count: 12100, description: 'Vibrant pop-art color master, character designer for Fire Emblem and VTubers' },
  { name: 'katoki_hajime', category: 'artist' as const, count: 6840, description: 'Legendary mecha designer for Gundam and sci-fi anime' },

  // Copyrights
  { name: 'cyberpunk_edgerunners', category: 'copyright' as const, count: 48900, description: 'Studio Trigger and CDPR anime set in Night City' },
  { name: 'sousou_no_frieren', category: 'copyright' as const, count: 84200, description: 'Fantasy manga and anime following elf mage Frieren' },
  { name: 'genshin_impact', category: 'copyright' as const, count: 342000, description: 'Open-world fantasy adventure game by HoYoverse' },
  { name: 'vocaloid', category: 'copyright' as const, count: 215000, description: 'Iconic singing synthesizer franchise featuring Hatsune Miku' },
  { name: 'mecha_chronicles', category: 'copyright' as const, count: 24100, description: 'Sci-fi mecha universe and industrial robot warfare' },
  { name: 'original', category: 'copyright' as const, count: 420000, description: 'Artworks created entirely from original concept' },

  // Characters
  { name: 'frieren', category: 'character' as const, count: 62400, description: 'Centuries-old elven mage who defeated the Demon King' },
  { name: 'raiden_shogun', category: 'character' as const, count: 89300, description: 'The Electro Archon and ruler of Inazuma' },
  { name: 'lucy_(cyberpunk)', category: 'character' as const, count: 38100, description: 'Mysterious netrunner from Cyberpunk: Edgerunners' },
  { name: 'hatsune_miku', category: 'character' as const, count: 198000, description: 'The legendary twin-tailed virtual singer' },
  { name: 'yae_miko', category: 'character' as const, count: 45600, description: 'Guuji of the Grand Narukami Shrine and chief editor of Yae Publishing House' },
  { name: 'fern', category: 'character' as const, count: 31200, description: 'Mage apprentice traveling with Frieren' },

  // General
  { name: '1girl', category: 'general' as const, count: 890000, description: 'Single female subject focus' },
  { name: 'scenic', category: 'general' as const, count: 320000, description: 'Grand landscapes, environments, and architectural settings' },
  { name: 'cyberpunk_city', category: 'general' as const, count: 74000, description: 'Futuristic cityscapes featuring neon, holograms, and high tech' },
  { name: 'katana', category: 'general' as const, count: 88500, description: 'Japanese curved single-edged sword' },
  { name: 'cherry_blossoms', category: 'general' as const, count: 64200, description: 'Sakura flowers, trees, or falling blossom petals' },
  { name: 'starry_sky', category: 'general' as const, count: 96000, description: 'Night sky filled with constellations, milky way, or auroras' },
  { name: 'tree_of_life', category: 'general' as const, count: 28400, description: 'Ancient monumental sacred or glowing tree' },
  { name: 'mecha', category: 'general' as const, count: 112000, description: 'Piloted combat robots and mechanized armor' },
  { name: 'neon_lights', category: 'general' as const, count: 81200, description: 'Luminous neon signs and glowing accents' },
  { name: 'rain', category: 'general' as const, count: 67300, description: 'Rainfall, wet asphalt, or puddles' },
  { name: 'solo', category: 'general' as const, count: 760000, description: 'Only one character in the frame' },

  // Meta
  { name: 'masterpiece', category: 'meta' as const, count: 540000, description: 'Top-tier technical excellence in digital illustration' },
  { name: 'highres', category: 'meta' as const, count: 980000, description: 'High-resolution artwork file suitable for display' },
  { name: 'wallpaper', category: 'meta' as const, count: 210000, description: '16:9 or 21:9 ultra-wide desktop aspect ratio' },
  { name: 'dramatic_lighting', category: 'meta' as const, count: 86000, description: 'High contrast chiaroscuro, volumetric beams, rim lights' }
];
