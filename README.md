# chat-sistemas-distribuidos-websockets
Chat desenvolvido para a disciplina de Sistemas Distribuídos utilizando WebSockets

## Requisitos
* node 
* porta 3010 liberada
* ws instalado
* express instalado

## Iniciando a aplicação
A aplicação trata-se de um chat via navegador web. Para executar ela execute os comandos abaixo dentro do terminal:
* node index.js
No navegador use:
* localhost:3010/index.html

**ATENÇÃO: Para criar salas é necessário entrar como administrador** <br>
**Se promover para admin: /promotetoadmin 147852369**

## Comandos
* Listar comandos: /help
* Promover-se a administrador: /promotetoadmin 147852369  
* Criar salas: /createroom
* Mostrar salas: /rooms
* Entrar em sala: /joinroom numero_da_sala (ex: /joinroom 0)
* Sair da aplicação: /quit
* Trocar nome de usuário: /myname seu_Nome (não use espaços, ex: /myname Lucas)
* Remover usuário da sala: /kick numero_da_sala id_do_usuario (ex: kick 0 0)
* Banir usuário da sala: /ban numero_da_sala id_do_usuario (ex: /ban 0 0)

## Desenvolvedores
* Pablo Thadeu Abreu
* Hilton Oliveira Segunda
