import express from 'express';
import { createServer as createViteServer } from 'vite';
import axios from 'axios';
import https from 'https';

const app = express();
const PORT = 3000;

app.use(express.json());

const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 64,
  maxFreeSockets: 32,
  timeout: 15000,
});

const axiosClient = axios.create({
  httpsAgent,
  timeout: 8000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  },
});

/**
 * Normalizes Pinterest image URL to original highest resolution
 */
function upgradeToOriginals(url: string): string {
  if (!url) return url;
  if (url.includes('i.pinimg.com/') && !url.includes('/originals/')) {
    return url.replace(/i\.pinimg\.com\/[0-9]+x\//, 'i.pinimg.com/originals/');
  }
  return url;
}

/**
 * 1. Nexray Pinterest Search API
 */
async function searchViaNexray(query: string): Promise<string[]> {
  try {
    const res = await axiosClient.get('https://api.nexray.eu.cc/search/pinterest', {
      params: { q: query },
      timeout: 6000,
    });

    const list = res.data?.result || res.data?.data || [];
    if (Array.isArray(list) && list.length > 0) {
      const urls: string[] = [];
      for (const item of list) {
        const img =
          item.images_url ||
          item.image ||
          item.imageUrl ||
          (typeof item === 'string' ? item : null);
        if (img && typeof img === 'string') {
          urls.push(upgradeToOriginals(img));
        }
      }
      return urls;
    }
  } catch (_) {}
  return [];
}

/**
 * 2. Siputzx Pinterest Search API
 */
async function searchViaSiputzx(query: string): Promise<string[]> {
  try {
    const res = await axiosClient.get('https://api.siputzx.my.id/api/s/pinterest', {
      params: { query },
      timeout: 6000,
    });

    const list = res.data?.data || res.data?.result || [];
    if (Array.isArray(list) && list.length > 0) {
      const urls: string[] = [];
      for (const item of list) {
        const img =
          item.image_url ||
          item.images_url ||
          item.image ||
          item.imageUrl ||
          (typeof item === 'string' ? item : null);
        if (img && typeof img === 'string') {
          urls.push(upgradeToOriginals(img));
        }
      }
      return urls;
    }
  } catch (_) {}
  return [];
}

/**
 * 3. Fallback direct Pinterest public scraper
 */
async function searchViaPinterestDirect(query: string): Promise<string[]> {
  try {
    const res = await axiosClient.get(
      `https://www.pinterest.com/resource/BaseSearchResource/get/`,
      {
        params: {
          source_url: `/search/pins/?q=${encodeURIComponent(query)}`,
          data: JSON.stringify({
            options: {
              query,
              scope: 'pins',
              page_size: 25,
            },
            context: {},
          }),
        },
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Referer: 'https://www.pinterest.com/',
        },
        timeout: 6000,
      }
    );

    const results = res.data?.resource_response?.data?.results || [];
    const urls: string[] = [];
    for (const pin of results) {
      const img =
        pin.images?.orig?.url ||
        pin.images?.['736x']?.url ||
        pin.images?.['564x']?.url;
      if (img) {
        urls.push(upgradeToOriginals(img));
      }
    }
    return urls;
  } catch (_) {}
  return [];
}

/**
 * Fast-First Turbo API Search
 */
async function searchPinterest(query: string, maxResults: number = 10): Promise<string[]> {
  const seen = new Set<string>();
  const combinedUrls: string[] = [];

  const addUnique = (urls: string[]) => {
    for (const u of urls) {
      if (u && !seen.has(u)) {
        seen.add(u);
        combinedUrls.push(u);
      }
    }
  };

  const results = await new Promise<string[]>((resolve) => {
    let settledCount = 0;
    let isResolved = false;

    const handleResult = (urls: string[]) => {
      settledCount++;
      addUnique(urls);

      if (!isResolved && combinedUrls.length >= maxResults) {
        isResolved = true;
        resolve(combinedUrls.slice(0, maxResults));
        return;
      }

      if (settledCount >= 2 && !isResolved) {
        isResolved = true;
        resolve(combinedUrls);
      }
    };

    searchViaNexray(query).then(handleResult).catch(() => handleResult([]));
    searchViaSiputzx(query).then(handleResult).catch(() => handleResult([]));
  });

  // If we need more results for large counts (30, 50, 100), supplement from direct search
  if (combinedUrls.length < maxResults) {
    const fallback = await searchViaPinterestDirect(query);
    addUnique(fallback);
  }

  return combinedUrls.slice(0, maxResults);
}

/**
 * Pinterest Downloader API
 */
async function downloadPinterestUrl(url: string): Promise<{ video?: string | null; image?: string | null } | null> {
  // Try Nexray
  try {
    const res = await axiosClient.get('https://api.nexray.eu.cc/downloader/pinterest', {
      params: { url },
      timeout: 6000,
    });
    const data = res.data?.result || res.data?.data;
    if (data) {
      const vid = data.video || data.video_url || (Array.isArray(data.videos) && data.videos[0]);
      const img = data.image || data.image_url || data.images_url || (Array.isArray(data.images) && data.images[0]);
      if (vid || img) return { video: vid || null, image: img || null };
    }
  } catch (_) {}

  // Try Siputzx
  try {
    const res = await axiosClient.get('https://api.siputzx.my.id/api/d/pinterest', {
      params: { url },
      timeout: 6000,
    });
    const data = res.data?.data;
    if (data) {
      const vid = data.video || data.video_url;
      const img = data.image || data.image_url;
      if (vid || img) return { video: vid || null, image: img || null };
    }
  } catch (_) {}

  return null;
}

// Global Bot State
interface BotLog {
  id: string;
  time: string;
  user: string;
  query: string;
  status: 'success' | 'error' | 'info';
  details: string;
}

interface PendingSearch {
  query: string;
  chatId: number;
  timestamp: number;
}

let currentBotToken: string | null = null;
let botInfo: any = null;
let isPolling = false;
let pollingOffset = 0;
let requestCount = 0;
let botLogs: BotLog[] = [];
const pendingSearches = new Map<string, PendingSearch>();

function addLog(user: string, query: string, status: 'success' | 'error' | 'info', details: string) {
  const log: BotLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    time: new Date().toLocaleTimeString(),
    user,
    query,
    status,
    details,
  };
  botLogs = [log, ...botLogs.slice(0, 49)];
}

/**
 * Telegram API Helpers
 */
async function callTelegram(method: string, data: any) {
  if (!currentBotToken) throw new Error('No bot token set');
  const res = await axios.post(`https://api.telegram.org/bot${currentBotToken}/${method}`, data, {
    timeout: 15000,
  });
  return res.data;
}

/**
 * Handle incoming callback query when user clicks count buttons (10, 20, 30, 50, 100)
 */
async function handleTelegramCallbackQuery(callbackQuery: any) {
  if (!callbackQuery || !callbackQuery.message) return;
  const callbackId = callbackQuery.id;
  const data = callbackQuery.data || '';
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const user = callbackQuery.from?.username
    ? `@${callbackQuery.from.username}`
    : callbackQuery.from?.first_name || 'User';

  const parts = data.split(':');
  if (parts[0] !== 'cnt') return;

  const countStr = parts[1];
  const sessionId = parts[2];
  const session = pendingSearches.get(sessionId);

  if (countStr === 'cancel') {
    try {
      await callTelegram('answerCallbackQuery', {
        callback_query_id: callbackId,
        text: 'Search cancelled.',
      });
      await callTelegram('editMessageText', {
        chat_id: chatId,
        message_id: messageId,
        text: '❌ Search cancelled.',
      });
    } catch (_) {}
    pendingSearches.delete(sessionId);
    return;
  }

  const count = parseInt(countStr, 10) || 10;
  const query = session?.query || 'aesthetic';

  try {
    await callTelegram('answerCallbackQuery', {
      callback_query_id: callbackId,
      text: `Fetching ${count} images...`,
    });

    await callTelegram('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text: `⏳ *Scraping ${count} HD Pinterest images for:* \`${query}\`...\n_Please wait, fetching results..._`,
      parse_mode: 'Markdown',
    });
  } catch (_) {}

  addLog(user, `${query} (${count})`, 'info', `Scraping ${count} images...`);

  try {
    const urls = await searchPinterest(query, count);
    if (!urls || urls.length === 0) {
      await callTelegram('sendMessage', {
        chat_id: chatId,
        text: `❌ Pinterest par "${query}" ke liye koi image nahi mili.`,
      });
      addLog(user, query, 'error', 'No images found');
      return;
    }

    const actualUrls = urls.slice(0, count);
    let sentCount = 0;
    const chunkSize = 10; // Telegram album limit is 10 photos

    for (let i = 0; i < actualUrls.length; i += chunkSize) {
      const chunk = actualUrls.slice(i, i + chunkSize);
      const media = chunk.map((url, idx) => ({
        type: 'photo',
        media: url,
        caption: i === 0 && idx === 0 ? `📌 *Pinterest HD:* \`${query}\` (${actualUrls.length} images)` : undefined,
        parse_mode: 'Markdown',
      }));

      try {
        await callTelegram('sendMediaGroup', {
          chat_id: chatId,
          media: JSON.stringify(media),
        });
        sentCount += chunk.length;
      } catch (err) {
        // Fallback: send individually if media group fails
        for (const singleUrl of chunk) {
          try {
            await callTelegram('sendPhoto', {
              chat_id: chatId,
              photo: singleUrl,
            });
            sentCount++;
          } catch (_) {}
        }
      }

      // Small delay between albums to prevent flood limit
      if (i + chunkSize < actualUrls.length) {
        await new Promise((r) => setTimeout(r, 1200));
      }
    }

    if (sentCount > 0) {
      addLog(user, query, 'success', `Delivered ${sentCount} images`);
    } else {
      await callTelegram('sendMessage', {
        chat_id: chatId,
        text: `❌ Images deliver nahi ho saki. Please try another keyword.`,
      });
      addLog(user, query, 'error', 'Delivery failed');
    }
  } catch (err: any) {
    addLog(user, query, 'error', err?.message || 'Scrape failed');
    await callTelegram('sendMessage', {
      chat_id: chatId,
      text: `❌ Error scraping Pinterest images.`,
    });
  } finally {
    pendingSearches.delete(sessionId);
  }
}

/**
 * Handle incoming message from Telegram
 */
async function handleTelegramMessage(message: any) {
  if (!message || !message.chat) return;

  const chatId = message.chat.id;
  const username = message.from?.username ? `@${message.from.username}` : message.from?.first_name || 'User';
  let text = (message.text || '').trim();

  if (!text) return;

  requestCount++;

  // Command: /start
  if (text === '/start') {
    addLog(username, '/start', 'info', 'Sent welcome message');
    await callTelegram('sendMessage', {
      chat_id: chatId,
      text:
        `👋 *Welcome to Pinterest HD Bot!*\n\n` +
        `Send me any keyword, and select how many images you want!\n\n` +
        `*Examples:*\n` +
        `• \`anime wallpaper\`\n` +
        `• \`cyberpunk aesthetic\`\n` +
        `• \`vintage cars 4k\`\n` +
        `• Or paste a link: \`https://pin.it/...\``,
      parse_mode: 'Markdown',
    });
    return;
  }

  // Clean prefix if user used .pint or /pint
  let query = text.replace(/^(\.|\/)pint(x)?\s*/i, '').trim();
  if (!query) query = text;

  // Branch 1: Pinterest URL Downloader
  if (query.match(/^https?:\/\/(www\.)?(pin\.it|pinterest\.com)/i)) {
    addLog(username, query, 'info', 'Downloading Pinterest URL...');
    await callTelegram('sendMessage', {
      chat_id: chatId,
      text: '⏳ *Fetching HD Pinterest Media...*',
      parse_mode: 'Markdown',
    });

    const media = await downloadPinterestUrl(query);
    if (media && (media.video || media.image)) {
      if (media.video) {
        await callTelegram('sendVideo', {
          chat_id: chatId,
          video: media.video,
          caption: '✨ *Downloaded from Pinterest*',
          parse_mode: 'Markdown',
        });
      } else if (media.image) {
        await callTelegram('sendPhoto', {
          chat_id: chatId,
          photo: media.image,
          caption: '✨ *Downloaded from Pinterest*',
          parse_mode: 'Markdown',
        });
      }
      addLog(username, query, 'success', 'Sent media from URL');
    } else {
      await callTelegram('sendMessage', {
        chat_id: chatId,
        text: '❌ *Failed to download media from this Pinterest link.*',
        parse_mode: 'Markdown',
      });
      addLog(username, query, 'error', 'Failed to resolve URL');
    }
    return;
  }

  // Branch 2: Keyword Search -> Send Inline Buttons (10, 20, 30, 50, 100)
  addLog(username, query, 'info', 'Prompting image count buttons');
  const sessionId = `s_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  pendingSearches.set(sessionId, { query, chatId, timestamp: Date.now() });

  await callTelegram('sendMessage', {
    chat_id: chatId,
    text:
      `📌 *Pinterest Search:* \`${query}\`\n\n` +
      `Kitni HD images chahiye? Choose karein:`,
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '10 Images', callback_data: `cnt:10:${sessionId}` },
          { text: '20 Images', callback_data: `cnt:20:${sessionId}` },
          { text: '30 Images', callback_data: `cnt:30:${sessionId}` },
        ],
        [
          { text: '50 Images', callback_data: `cnt:50:${sessionId}` },
          { text: '100 Images', callback_data: `cnt:100:${sessionId}` },
        ],
        [
          { text: '❌ Cancel', callback_data: `cnt:cancel:${sessionId}` },
        ],
      ],
    },
  });
}

/**
 * Long Polling loop for Telegram Bot
 */
async function startTelegramPolling() {
  if (!currentBotToken || isPolling) return;
  isPolling = true;

  while (isPolling && currentBotToken) {
    try {
      const res = await axios.get(
        `https://api.telegram.org/bot${currentBotToken}/getUpdates`,
        {
          params: {
            offset: pollingOffset,
            timeout: 10,
          },
          timeout: 15000,
        }
      );

      const updates = res.data?.result || [];
      for (const update of updates) {
        pollingOffset = update.update_id + 1;
        if (update.message) {
          handleTelegramMessage(update.message).catch(() => {});
        } else if (update.callback_query) {
          handleTelegramCallbackQuery(update.callback_query).catch(() => {});
        }
      }
    } catch (err: any) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

// REST API Endpoints for Frontend UI
app.get('/api/bot/status', (req, res) => {
  res.json({
    connected: !!currentBotToken,
    botInfo,
    isPolling,
    requestCount,
    logs: botLogs,
  });
});

app.post('/api/bot/connect', async (req, res) => {
  const { token } = req.body;
  const cleanToken = (token || '').trim();

  if (!cleanToken) {
    return res.status(400).json({ error: 'Please enter a valid Telegram BotFather token' });
  }

  try {
    const check = await axios.get(`https://api.telegram.org/bot${cleanToken}/getMe`, {
      timeout: 8000,
    });

    if (check.data?.ok && check.data.result) {
      isPolling = false; // stop any previous loop
      currentBotToken = cleanToken;
      botInfo = check.data.result;
      pollingOffset = 0;
      addLog('System', 'Connect', 'success', `Connected bot @${botInfo.username}`);

      // Start polling in background
      startTelegramPolling().catch(() => {});

      return res.json({
        success: true,
        botInfo,
      });
    } else {
      return res.status(401).json({ error: 'Invalid token or unauthorized' });
    }
  } catch (err: any) {
    return res.status(400).json({
      error: err.response?.data?.description || 'Failed to verify bot token with Telegram',
    });
  }
});

app.post('/api/bot/disconnect', (req, res) => {
  isPolling = false;
  currentBotToken = null;
  botInfo = null;
  addLog('System', 'Disconnect', 'info', 'Bot disconnected');
  res.json({ success: true });
});

app.post('/api/bot/test-search', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Search query required' });
  }

  try {
    const urls = await searchPinterest(query, 12);
    res.json({
      query,
      count: urls.length,
      images: urls,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message || 'Scraper failed' });
  }
});

// Vite integration
async function startServer() {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pinterest Telegram Bot server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
