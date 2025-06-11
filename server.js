require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer'); // Добавляем multer
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const port = 3000;

const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;
const bot = new TelegramBot(token, { polling: false });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Настройка multer для обработки FormData
const upload = multer();

app.post('/submit', upload.none(), (req, res) => {
    const { name, age, phone, telegram } = req.body;

    // Валидация возраста
    if (age < 16 || age > 35) {
        return res.status(400).json({ success: false, message: 'Возраст должен быть от 16 до 35 лет' });
    }

    // Валидация номера телефона
    if (!phone.startsWith('+380')) {
        return res.status(400).json({ success: false, message: 'Номер телефона должен начинаться с +380' });
    }

    // Формирование сообщения для Telegram
    const message = `
Новая заявка:
Имя: ${name}
Возраст: ${age}
Телефон: ${phone}
Telegram: ${telegram || 'Не указано'}
    `;

    // Отправка сообщения в Telegram
    bot.sendMessage(chatId, message)
        .then(() => {
            res.json({ success: true });
        })
        .catch((error) => {
            console.error('Ошибка при отправке в Telegram:', error);
            res.status(500).json({ success: false, message: 'Ошибка при отправке заявки' });
        });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});