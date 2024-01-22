require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const { DateTime } = require('luxon');
const botToken = process.env.BOT_TOKEN;
const telegramBot = new TelegramBot(botToken, {polling: true});
const axios = require('axios');

( async () => {
    const Bot = require('./app/bot');
    const bot = new Bot({
        telegramBot,
        axios,
        dateTime: DateTime
    });

    await bot.interact();
    console.log('Bot is active.');
})();
