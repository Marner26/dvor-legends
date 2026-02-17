const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinGame", (username) => {
        players[socket.id] = {
            username,
            street: 0,
            smart: 0,
            meme: 0,
            drip: 0
        };

        io.emit("updatePlayers", players);
    });

    socket.on("rapBattle", () => {
        let player = players[socket.id];
        if (!player) return;

        if (Math.random() > 0.5) {
            player.street += 5;
            player.meme += 2;
        } else {
            player.street -= 2;
        }

        io.emit("updatePlayers", players);
    });

    socket.on("chatMessage", (msg) => {
        let player = players[socket.id];
        if (!player) return;

        io.emit("chatMessage", {
            username: player.username,
            message: msg
        });
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        io.emit("updatePlayers", players);
    });
});

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
