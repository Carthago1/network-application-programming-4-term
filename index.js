const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const crypto = require('coinlayer-wrapper');
const coin = new crypto(process.env.COIN_TOKEN);
const cur = 'RUB';
const all_cryptocurrencies = require('./const');
let cryptocurrency = '';

const timer = ms => new Promise(res => setTimeout(res, ms));

async function create_notification(ctx) {
    price = +ctx.message.text;
    let data = {};
    do {
        data = await coin.livedata(cur, cryptocurrency);
        await timer(5000);
    } while(price < +data.rate);
    ctx.reply(`Стоимость ${cryptocurrency} достигла ${data.rate} RUB`)
  }

bot.start(async (ctx) => {
    await ctx.reply('Введите идентификатор криптовалюты', Markup.inlineKeyboard(
        [
            [Markup.button.callback('Показать все идентификаторы', 'btn_all')]
        ]
    ))
})

bot.action('btn_all', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(all_cryptocurrencies.cryptocurrencies);
})

bot.on('text', async (ctx) => {
    let str = ctx.message.text;
    let regexp = /^(0$|-?[1-9]\d*(\.\d*[1-9]$)?|-?0\.\d*[1-9])$/;
    let match = str.match(regexp);
    let bool = Boolean(match);
    if(bool) {
        create_notification(ctx);
    }
    else {
        let data = await coin.livedata(cur, ctx.message.text.toUpperCase());
        cryptocurrency = ctx.message.text.toUpperCase();
        ctx.reply(`Стоимость ${ctx.message.text} - ${data.rate} RUB`, Markup.inlineKeyboard(
            [
                [Markup.button.callback('Поставить уведомление', 'btn_notification')]
            ]
        ));
    }

})
bot.action('btn_notification', async (ctx)=> {
    await ctx.answerCbQuery();
    await ctx.reply('Введите желаемую стоимость');
})

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))