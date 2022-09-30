import time
from req import request
import config
import telebot

bot = telebot.TeleBot(config.token)

data = request()
notification_currency = ''


@bot.message_handler(commands=["start"])
def start(message):
    markup = telebot.types.ReplyKeyboardMarkup(row_width=1,resize_keyboard=True)
    markup.add(telebot.types.KeyboardButton('Показать все названия'))
    bot.send_message(message.chat.id, 'Введите интересующую криптовалюту', reply_markup=markup)


@bot.message_handler(func=lambda message: message.text.isdigit())
def notification(message):
    data = request()
    price = int(message.text)
    while data["rates"][notification_currency] > price:
        time.sleep(5)
        data = request()
    bot.send_message(message.chat.id, f'{notification_currency} стоит {data["rates"][notification_currency]}')


@bot.message_handler(func=lambda message: message.text == 'Поставить уведомление')
def notification(message):
    bot.send_message(message.chat.id, 'Введите цену')


@bot.message_handler(content_types=["text"])
def main(message):
    if message.text == 'Показать все названия':
        message_data = ''
        for x in data["rates"]:
            message_data += x + '\n'
        bot.send_message(message.chat.id, message_data)
    elif message.text.upper() in data["rates"]:
        global notification_currency
        notification_currency = message.text.upper()
        markup = telebot.types.ReplyKeyboardMarkup(row_width=1,resize_keyboard=True)
        markup.add(telebot.types.KeyboardButton('Поставить уведомление'))
        bot.send_message(message.chat.id, f'{data["rates"][message.text.upper()]} RUB', reply_markup=markup)
    else:
        bot.send_message(message.chat.id, 'Incorrect command')


if __name__ == '__main__':
    bot.infinity_polling()