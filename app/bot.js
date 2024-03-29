const ratesApiUrl = process.env.GET_RATES_URL;
const convertCurrencyUrl = process.env.CONVERT_URL;
const DATE_FORMAT = /^[1,2][0-9]{3}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/;
const CONVERT_REGEXP = /(\d+) ([A-Z]{3}) ([A-Z]{3})/
const currencies = require('./currencies');

class Bot {
    constructor({ telegramBot, axios, dateTime }) {
        this.telegramBot = telegramBot;
        this.axios = axios;
        this.dateTime = dateTime;
    }

    async interact() {
        await this.telegramBot.onText(/\/rates (.+)/, async (message, match) => {
            try {
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
            } catch (error) {
                this.telegramBot.sendMessage(chatId, 'Something went wrong');
                console.log(error.message);
            }
            
        });

        await this.telegramBot.onText(/\/today/, async message => {
            const chatId = message.chat.id;
            const currentDate = this.dateTime.now().toString().split('T')[0];
            try {
                const result = await this.axios.post(ratesApiUrl, {
                    date: currentDate
                });
                const USDRate = result.data.USDRate;
                const EURRate = result.data.EURRate;
              
                this.telegramBot.sendMessage(chatId, `Here are requested rates for today: 
                USD rate: ${USDRate},
                EUR rate ${EURRate}`);
            } catch (error) {
                this.telegramBot.sendMessage(chatId, 'Something went wrong');
                console.log(error.message);
            }
            
        });

        await this.telegramBot.onText(/\/convert (.+)/, async (message, match) => {
            const chatId = message.chat.id;
            const dataFromMessage = match[1].match(CONVERT_REGEXP);

            try {
            if (!Object.values(currencies).includes(dataFromMessage[2])) {
                this.telegramBot.sendMessage(chatId, 'First currency is invalid, please use UAH/USD/EUR');
                return;
            }
            if (!Object.values(currencies).includes(dataFromMessage[3])) {
                this.telegramBot.sendMessage(chatId, 'Second currency is invalid, please use UAH/USD/EUR');
                return;
            }
                const result = await this.axios.post(convertCurrencyUrl, {
                    amount: dataFromMessage[1],
                    firstCurrency: dataFromMessage[2],
                    secondCurrency: dataFromMessage[3]
                });
                this.telegramBot.sendMessage(chatId, `By converting ${dataFromMessage[1]} ${dataFromMessage[2]}` + 
                ` you will get ${result.data.result} ${dataFromMessage[3]}`);
            } catch (error) {
                this.telegramBot.sendMessage(chatId, 'Something went wrong');
                console.log(error.message);
            }
        });
    }
}

module.exports = Bot;
