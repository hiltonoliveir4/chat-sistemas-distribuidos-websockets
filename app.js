class Interpreter {
  constructor(socket, config) {
    this.socket = socket;
    this.config = config;
  }

  promoteToAdmin() {
    if (this.socket.admin) {
      this.socket.send("[SISTEMA] Você já é um administrador!");
    } else {
      this.socket.admin = true;
      this.socket.send("[SISTEMA] Você foi promovido a administrador!");
    }
  }

  createRoom() {
    if (this.socket.admin) {
      this.config.roomsList.push({
        id: this.config.idRoom++,
        users: [],
        blackList: [],
      });
      this.socket.send(
        `[Sistema] Sala ${this.config.idRoom - 1} criada com sucesso`
      );
    } else {
      this.socket.send("[SISTEMA] Apenas administradores podem criar salas");
    }
  }

  joinRoom(comando) {
    const fullComand = comando.split(" ");

    if (fullComand.length == 2) {
      const room = fullComand[1];
      var salaEncontrada = false;
      this.config.roomsList.map((item) => {
        if (item.id == room) {
          salaEncontrada = true;
          if (item.blackList.includes(this.socket.id)) {
            this.socket.send("[SISTEMA] Você foi banido desta sala");
          } else {
            if (this.socket.currentRoom != undefined) {
              const sala = this.config.roomsList[this.socket.currentRoom];
              const indice = sala.users.indexOf(this.socket);
              sala.users.splice(indice, 1);
            }
            this.socket.currentRoom = room;
            this.config.roomsList[room].users.push(this.socket);
            this.config.roomsList[room].users.map((item) => {
              item.send(
                this.socket.myName
                  ? `[SISTEMA] ${this.socket.myName} entrou na sala ${room}`
                  : `[SISTEMA] ${this.socket.id} entrou na sala ${room}`
              );
            });
          }
        }
      });
      if (!salaEncontrada) {
        this.socket.send("[SISTEMA] Sala não encontrada");
      }
    } else {
      this.socket.send("[SISTEMA] Você deve informar o id de uma sala");
    }
  }

  showRooms() {
    var participantes = `[SISTEMA] Lista de salas, use o comando /joinroom *Numero da sala* para acessar<br>`;

    this.config.roomsList.map((item) => {
      participantes += `-----------Sala ${item.id}-------------<br>Participantes: ${item.users.length}<br>`;

      item.users.map((element, index) => {
        participantes += element.myName
          ? `[${index}] - ${element.myName}<br>`
          : `[${index}] - ${element.id}<br>`;
      });
    });

    this.socket.send(participantes);
  }

  changeName(comando) {
    const name = comando.split(" ");
    if (name[1] != "" && name[1].length < 16) {
      this.socket.myName = name[1];
      this.socket.send(
        `[SISTEMA] Nome alterado com sucesso para ${this.socket.myName}`
      );
    } else {
      this.socket.send("[SISTEMA] O nome deve ter entre 1 e 15 caracteres");
    }
  }

  help() {
    this.socket.send(
      "[SISTEMA]*Criar salas: /createroom<br>Mostrar salas: /rooms<br>Entrar em sala: /joinroom *numero da sala* (ex: /joinroom 0)<br>Sair da aplicação: /quit<br>Trocar nome de usuário: /myname *Seu_Nome* (não use espaços, ex: /myname pablo)<br>Se promover para admin: /promotetoadmin 147852369<br>Remover usuário da sala: /kick *numero da sala* *id do usuario* (ex: /kick 0 0)<br>Banir usuário da sala: /ban *numero da sala* *id do usuario* (/ban 0 0)"
    );
  }

  logoff() {
    if (this.socket.currentRoom != undefined) {
      this.config.roomsList.map((item) => {
        if (item.id == this.socket.currentRoom) {
          for (var i = 0; i < item.users.length; i++) {
            if (item.users[i] == this.socket) {
              item.users.splice(i, 1);
              continue;
            }
          }
        }
      });
    }
    this.socket.send("[SISTEMA] Você foi desconectado");
    this.socket.close();
  }

  kick(comando) {
    if (this.socket.admin) {
      const kickcommand = comando.split(" ");
      const selectedRoomId = kickcommand[1];
      const userPosition = kickcommand[2];
      var kickado = false;

      if (this.config.roomsList[selectedRoomId] != undefined) {
        if (
          this.config.roomsList[selectedRoomId].users[userPosition] != undefined
        ) {
          this.config.roomsList[selectedRoomId].users[userPosition].send(
            "[SISTEMA] Você foi removido da sala!"
          );
          this.config.roomsList[selectedRoomId].users[
            userPosition
          ].currentRoom = undefined;
          this.config.roomsList[selectedRoomId].users.splice(userPosition, 1);
          kickado = true;
        }
      }
      kickado
        ? this.socket.send("[SISTEMA] Operação realizada com sucesso")
        : this.socket.send("[SISTEMA] Operação não realizada");
    } else {
      this.socket.send("[SISTEMA] Você não é um admin");
    }
  }

  ban(comando) {
    if (this.socket.admin) {
      const bancommand = comando.split(" ");
      const selectedRoomId = bancommand[1];
      const userPosition = bancommand[2];
      var banido = false;

      if (this.config.roomsList[selectedRoomId] != undefined) {
        if (this.config.roomsList[selectedRoomId].users[userPosition]) {
          this.config.roomsList[selectedRoomId].users[userPosition].send(
            "[SISTEMA] Você foi banido da sala!"
          );
          this.config.roomsList[selectedRoomId].blackList.push(
            this.config.roomsList[selectedRoomId].users[userPosition].id
          );
          this.config.roomsList[selectedRoomId].users[
            userPosition
          ].currentRoom = undefined;
          this.config.roomsList[selectedRoomId].users.splice(userPosition, 1);
          banido = true;
        }
      }

      banido
        ? this.socket.send("[SISTEMA] Operação realizada com sucesso")
        : this.socket.send("[SISTEMA] Operação não realizada");
    } else {
      this.socket.send("[SISTEMA] Você não é um admin");
    }
  }

  message(mensagem) {
    if (this.socket.currentRoom != undefined) {
      const sala = this.config.roomsList[this.socket.currentRoom];
      const i = sala.users.indexOf(this.socket);
      sala.users.map((item) => {
        if (item !== this.socket) {
          if (this.socket.myName != undefined) {
            item.send(`[${i}] - ${this.socket.myName}> ${mensagem}`);
          } else {
            item.send(`[${i}] - ${this.socket.id}> ${mensagem}`);
          }
        }
      });
    } else {
      this.socket.send(
        "[SISTEMA] Você não está em nenhuma sala, utilize o comando /help para saber as opções"
      );
    }
  }
}

module.exports = Interpreter;
