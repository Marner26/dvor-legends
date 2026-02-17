const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {
    console.log("Пользователь подключен:", socket.id);

    socket.on("joinGame", (username) => {
        if (!username) return;
        players[socket.id] = {
            username,
            street: 0,
            smart: 0,
            meme: 0,
            drip: 0
        };
        io.emit("chatMessage", { username: "Система", message: `${username} присоединился к игре! 🔥` });
        updateAll();
    });

    socket.on("rapBattle", () => {
        let player = players[socket.id];
        if (!player) return;

        let outcome = Math.random() > 0.5;
        if (outcome) {
            player.street += 5;
            player.meme += 2;
            player.drip += 1;
            io.emit("chatMessage", { username: "Система", message: `${player.username} выиграл рэп баттл! Реп +5 🔥 Мемы +2 😂 Стиль +1 👕` });
        } else {
            player.street = Math.max(0, player.street - 2);
            io.emit("chatMessage", { username: "Система", message: `${player.username} проиграл рэп баттл... Реп -2 😢` });
        }

        updateAll();
    });

    socket.on("chatMessage", (msg) => {
        let player = players[socket.id];
        if (!player || !msg.trim()) return;
        io.emit("chatMessage", { username: player.username, message: msg });
    });

    socket.on("disconnect", () => {
        let player = players[socket.id];
        if (player) io.emit("chatMessage", { username: "Система", message: `${player.username} покинул игру.` });
        delete players[socket.id];
        updateAll();
    });

    function updateAll() {
        io.emit("updatePlayers", players);
        io.emit("updateLeaderboard", Object.values(players).sort((a, b) => b.street - a.street));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Сервер запущен на порту", PORT));
