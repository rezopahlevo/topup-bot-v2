require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const GROUP_CHAT_ID = '@gruporderan'; // Ganti jika pakai ID langsung

// Start command
bot.onText(/\/start/, (msg) => {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Topup Zepeto via ID", callback_data: "topup" }],
        [{ text: "Premium Basic", callback_data: "premium" }]
      ]
    }
  };
  bot.sendMessage(msg.chat.id, "👋 Hai! Silakan pilih layanan:", opts);
});

// Pilihan menu
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'topup') {
    bot.sendMessage(chatId, `📝 *Format Order TopUp Zepeto:*\n\nID Zepeto | Nickname | Jumlah Zem | No WA\n\n_Contoh:_\n12345678 | Reza | 60z | 081234567890`, { parse_mode: 'Markdown' });
  }

  if (data === 'premium') {
    bot.sendMessage(chatId, `📝 *Format Order Premium Basic:*\n\nUsername | Paket | No WA\n\n_Contoh:_\n@userzepeto | 1 Bulan | 081234567890`, { parse_mode: 'Markdown' });
  }
});

// Tangkap order masuk
bot.on('message', async (msg) => {
  const text = msg.text;
  const isCommand = text.startsWith("/");

  if (!isCommand && text.includes('|')) {
    const chatId = msg.chat.id;

    await bot.sendPhoto(chatId, process.env.QRIS_IMAGE_URL, {
      caption: `💳 Silakan scan QRIS di atas untuk pembayaran.\nSetelah transfer, kirim bukti ke sini.\n\n📌 Order kamu sudah dicatat, akan segera diproses.`
    });

    const orderMsg = `📥 *ORDER MASUK*\nDari: [${msg.from.first_name}](tg://user?id=${msg.from.id})\n\n📄 *Detail:*\n${text}`;
    bot.sendMessage(GROUP_CHAT_ID, orderMsg, { parse_mode: "Markdown" });
  }
});

// Dummy web server (agar Railway tidak tidur)
const app = express();
app.get('/', (req, res) => {
  res.send('Bot Topup Zepeto Aktif ✅');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
