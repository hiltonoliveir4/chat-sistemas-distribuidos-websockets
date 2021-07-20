const PORT = process.env.PORT || 3000;
const INDEX = "index.html";

//importando as bibliotecas ws e express
const express = require("express");
const WebSocket = require("ws");

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Servidor funcionando na porta ${PORT}`));

//criando obejto do servidor websocket
const wss = new WebSocket.Server({ server });

const Interpreter = require("./app.js");

const config = {
  roomsList: [],
  idRoom: 0,
};

wss.on("connection", (socket) => {
  console.log(`Cliente conectado`);

  const interpreter = new Interpreter(socket, config);

  socket.on("message", (message) => {
    const comando = message;

    if (comando[0] == "/") {
      if (comando === "/createroom") {
        interpreter.createRoom();
      } else if (String(comando).match(/\/joinroom/)) {
        interpreter.joinRoom(comando);
      } else if (comando == "/rooms") {
        interpreter.showRooms();
      } else if (String(comando).match(/\/myname/)) {
        interpreter.changeName(comando);
      } else if (comando === "/help") {
        interpreter.help();
      } else if (comando == "/promotetoadmin 147852369") {
        interpreter.promoteToAdmin();
      } else if (String(comando).match(/\/kick/)) {
        interpreter.kick(comando);
      } else if (String(comando).match(/\/ban/)) {
        interpreter.ban(comando);
      } else {
        interpreter.message("[SISTEMA] use /help para ver os comandos disponíveis");
      }
    } else {
      interpreter.message(message);

      //   wss.clients.forEach((client) => {
      //     if (client != socket) {
      //       client.send(message);
      //     }
      //   });
    }
  });
});
