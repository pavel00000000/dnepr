require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const port = process.env.PORT || 3000;

const token = process.env.BOT_TOKEN;
const chatId = process.env.CHAT_ID;

// Проверка переменных окружения
if (!token || !chatId) {
  console.error('Ошибка: BOT_TOKEN и CHAT_ID должны быть заданы в переменных окружения');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: false });

app.use(cors()); // Разрешаем CORS для кросс-доменных запросов
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Обслуживание статических файлов из папки public

// Настройка multer для обработки multipart/form-data
const upload = multer();

app.post('/submit', upload.none(), (req, res) => {
  const { name, age, phone, telegram } = req.body;

  // Логирование полученных данных для отладки
  console.log('Полученные данные:', req.body);

  // Валидация возраста
  if (!age || isNaN(parseInt(age)) || parseInt(age) < 16 || parseInt(age) > 35) {
    return res.status(400).json({ success: false, message: 'Возраст должен быть от 16 до 35 лет' });
  }

// Валидация номера телефона (в контроллере на бэке)
if (phone) {
  const isValidFormat = phone.startsWith('+380') || phone.startsWith('0');
  if (!isValidFormat) {
    return res.status(400).json({
      success: false,
      message: 'Номер телефона должен начинаться с +380 или 0'
    });
  }


}


  // Формирование сообщения для Telegram
  const message = `
Новая заявка:
Имя: ${name || 'Не указано'}
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

// Маршрут для обслуживания index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Health check для Render
app.get('/health', (req, res) => res.sendStatus(200));

// Запуск сервера на 0.0.0.0 для Render
app.listen(port, '0.0.0.0', () => {
  console.log(`Сервер запущен и слушает порт ${port}`);
});