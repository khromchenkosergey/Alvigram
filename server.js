// Подключаем библиотеку для работы сетевых соединений
const WebSocket = require('ws');

// Запускаем сервер на порту хостинга и разрешаем внешние подключения
const port = process.env.PORT || 8080;
const server = new WebSocket.Server({ host: '0.0.0.0', port: port });

console.log('Сервер запущен на порту ' + port);

// Список всех подключенных пользователей
const clients = new Set();

// Когда кто-то подключается к серверу
server.on('connection', (ws) => {
    clients.add(ws);
    console.log('Новый пользователь подключился!');

    // Когда от пользователя приходит сообщение
    ws.on('message', (message) => {
        console.log('Получено сообщение: ' + message);

        // Пересылаем это сообщение ВСЕМ, КРОМЕ автора
        for (let client of clients) {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
                client.send(message.toString());
            }
        }
    });

    // Когда пользователь отключается
    ws.on('close', () => {
        clients.delete(ws);
        console.log('Пользователь отключился.');
    });
});
