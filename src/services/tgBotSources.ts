export interface BotSourceInfo {
  id: string;
  name: string;
  type: 'gif' | 'image' | 'both';
  authRequired: boolean;
  rateLimit: string;
  bestFor: string;
  whyBetterThanGelbooru: string;
  apiUrlExample: string;
  telegramMethod: 'sendPhoto' | 'sendAnimation';
  pythonExample: string;
  nodeExample: string;
}

export const BOT_SOURCES: BotSourceInfo[] = [
  {
    id: 'nekos-best',
    name: 'Nekos.best API',
    type: 'both',
    authRequired: false,
    rateLimit: 'Extremely generous / No key needed',
    bestFor: 'Anime GIFs (reactions, actions) & High-Quality anime images',
    whyBetterThanGelbooru: '100% Free, zero Cloudflare block on Telegram, ultra-fast CDN, returns direct mp4/gif & image URLs, perfect reaction tags (hug, pat, dance, cry, kiss).',
    apiUrlExample: 'https://nekos.best/api/v2/search?query={keyword}&type=2',
    telegramMethod: 'sendAnimation',
    pythonExample: `import requests
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

async def anime_gif(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyword = " ".join(context.args) if context.args else "dance"
    # Try action category first, or search endpoint
    url = f"https://nekos.best/api/v2/{keyword.lower()}"
    res = requests.get(url)
    
    if res.status_code != 200:
        # Fallback to general search
        url = f"https://nekos.best/api/v2/search?query={keyword}&type=2"
        res = requests.get(url)
        
    data = res.json()
    results = data.get("results", [])
    if results:
        gif_url = results[0]["url"]
        anime = results[0].get("anime_name", "")
        caption = f"✨ Keyword: {keyword}" + (f"\\n📺 Anime: {anime}" if anime else "")
        await update.message.reply_animation(animation=gif_url, caption=caption)
    else:
        await update.message.reply_text("Koi GIF nahi mila!")`,
    nodeExample: `import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('anime', async (ctx) => {
  const keyword = ctx.message.text.split(' ').slice(1).join(' ') || 'dance';
  try {
    let res = await fetch(\`https://nekos.best/api/v2/\${encodeURIComponent(keyword)}\`);
    if (!res.ok) {
      res = await fetch(\`https://nekos.best/api/v2/search?query=\${encodeURIComponent(keyword)}&type=2\`);
    }
    const data = await res.json();
    const item = data.results?.[0];
    if (item?.url) {
      await ctx.replyWithAnimation(item.url, {
        caption: \`✨ \${keyword} \${item.anime_name ? \`(\\n📺 \${item.anime_name})\` : ''}\`
      });
    } else {
      ctx.reply('No GIF found for this keyword!');
    }
  } catch (err) {
    ctx.reply('Error fetching anime gif');
  }
});

bot.launch();`
  },
  {
    id: 'waifu-im',
    name: 'Waifu.im API',
    type: 'image',
    authRequired: false,
    rateLimit: 'Free tier (No key required for basic queries)',
    bestFor: 'High-Res Anime Characters, Wallpapers, SFW/NSFW separation',
    whyBetterThanGelbooru: 'Specifically architected for Discord & Telegram bots. Clean REST JSON, no referer hotlink blocking, explicit tags like marin-kitagawa, raiden-shogun, maid, waifu.',
    apiUrlExample: 'https://api.waifu.im/search?included_tags={keyword}&is_nsfw=false',
    telegramMethod: 'sendPhoto',
    pythonExample: `import requests
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

async def anime_img(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyword = context.args[0] if context.args else "waifu"
    # Waifu.im search
    url = f"https://api.waifu.im/search?included_tags={keyword}&is_nsfw=false"
    res = requests.get(url)
    
    if res.status_code == 200:
        data = res.json()
        images = data.get("images", [])
        if images:
            img_url = images[0]["url"]
            artist = images[0].get("artist", {}).get("name", "Unknown")
            await update.message.reply_photo(
                photo=img_url,
                caption=f"🎨 Artist: {artist}\\n🏷 Tag: {keyword}"
            )
            return
    await update.message.reply_text("Artwork nahi mila!")`,
    nodeExample: `import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('pic', async (ctx) => {
  const keyword = ctx.message.text.split(' ')[1] || 'waifu';
  try {
    const res = await fetch(\`https://api.waifu.im/search?included_tags=\${keyword}&is_nsfw=false\`);
    const data = await res.json();
    if (data.images?.[0]?.url) {
      await ctx.replyWithPhoto(data.images[0].url, {
        caption: \`🎨 Tag: \${keyword}\`
      });
    } else {
      ctx.reply('No image found!');
    }
  } catch (e) {
    ctx.reply('Error fetching image');
  }
});`
  },
  {
    id: 'safebooru',
    name: 'Safebooru API',
    type: 'image',
    authRequired: false,
    rateLimit: 'No API key needed / Open',
    bestFor: 'Safe Booru replacement (No 18+ risks on Telegram)',
    whyBetterThanGelbooru: 'Gelbooru Telegram groups mein direct share karne par account ban ya block hone ka risk rehta hai. Safebooru 100% SFW hai, free JSON API deta hai aur hotlinks direct allow karta hai.',
    apiUrlExample: 'https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&tags={keyword}&limit=5',
    telegramMethod: 'sendPhoto',
    pythonExample: `import requests
from telegram import Update
from telegram.ext import ContextTypes

async def booru_search(update: Update, context: ContextTypes.DEFAULT_TYPE):
    tag = "_".join(context.args) if context.args else "scenic"
    url = f"https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&tags={tag}&limit=10"
    res = requests.get(url)
    
    if res.status_code == 200:
        posts = res.json()
        if posts:
            post = posts[0]
            # Safebooru CDN URL formula
            img_url = f"https://safebooru.org/images/{post['directory']}/{post['image']}"
            await update.message.reply_photo(photo=img_url, caption=f"🌸 Safebooru: {tag}")
            return
    await update.message.reply_text("Safebooru par koi image nahi mili.")`,
    nodeExample: `bot.command('safebooru', async (ctx) => {
  const tag = ctx.message.text.split(' ').slice(1).join('_') || 'frieren';
  const res = await fetch(\`https://safebooru.org/index.php?page=dapi&s=post&q=index&json=1&tags=\${tag}&limit=5\`);
  const posts = await res.json();
  if (posts?.[0]) {
    const p = posts[0];
    const imgUrl = \`https://safebooru.org/images/\${p.directory}/\${p.image}\`;
    ctx.replyWithPhoto(imgUrl, { caption: \`Safebooru Tag: \${tag}\` });
  }
});`
  },
  {
    id: 'tenor-gif',
    name: 'Tenor GIF API (Google)',
    type: 'gif',
    authRequired: true,
    rateLimit: 'Free Google Cloud API Key',
    bestFor: 'Universal Anime & Meme GIFs by any keyword',
    whyBetterThanGelbooru: 'Telegram khud Tenor use karta hai apne built-in @gif feature ke liye. Any keyword search instantly returns optimized animated webm/gif/mp4 URLs.',
    apiUrlExample: 'https://tenor.googleapis.com/v2/search?q={keyword}&key={API_KEY}&limit=5',
    telegramMethod: 'sendAnimation',
    pythonExample: `# Tenor V2 API Example
import requests

def get_tenor_gif(keyword, api_key):
    url = f"https://tenor.googleapis.com/v2/search?q={keyword}&key={api_key}&client_key=my_tg_bot&limit=1"
    r = requests.get(url).json()
    if r.get("results"):
        return r["results"][0]["media_formats"]["gif"]["url"]
    return None`,
    nodeExample: `// Fetch Tenor GIF
const url = \`https://tenor.googleapis.com/v2/search?q=\${encodeURIComponent(keyword)}&key=\${API_KEY}&limit=1\`;
const res = await fetch(url);
const data = await res.json();
const gifUrl = data.results?.[0]?.media_formats?.gif?.url;`
  }
];
