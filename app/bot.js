const ratesApiUrl = process.env.GET_RATES_URL;
const DATE_FORMAT = /^[1,2][0-9]{3}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/;

class Bot {
    constructor({ telegramBot, axios, dateTime }) {
        this.telegramBot = telegramBot;
        this.axios = axios;
        this.dateTime = dateTime;
    }

    async interact() {
        await this.telegramBot.onText(/\/rates (.+)/, async (message, match) => {
            if (!DATE_FORMAT.test(match[1])) {
                this.telegramBot.sendMessage('Invalid date format.');
                return;
            }
            const chatId = message.chat.id;
            const result = await this.axios.post(ratesApiUrl, {
                date: match[1]
            });
            const USDRate = result.data.USDRate;
            const EURRate = result.data.EURRate;
            const date = result.data.date;
          
            this.telegramBot.sendMessage(chatId, `Here are requested rates for ${date}: 
            USD rate: ${USDRate},
            EUR rate ${EURRate}`);
        });

        await this.telegramBot.onText(/\/today/, async message => {
            const chatId = message.chat.id;
            const currentDate = this.dateTime.now().toString().split('T')[0];
            const result = await this.axios.post(ratesApiUrl, {
                date: currentDate
            });
            const USDRate = result.data.USDRate;
            const EURRate = result.data.EURRate;
          
            this.telegramBot.sendMessage(chatId, `Here are requested rates for today: 
            USD rate: ${USDRate},
            EUR rate ${EURRate}`);
        });
    }
}

module.exports = Bot;
