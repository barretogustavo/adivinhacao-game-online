const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
console.log("Servidor rodando...")

// Armazena as conexões dos jogadores
const players = [];

// Lida com novas conexões de jogadores
server.on('connection', (socket) => {
  console.log('Novo jogador conectado');

  // Adiciona o jogador à lista de jogadores
  players.push(socket);
  console.log('Jogadores conectados: ', players.length);

  // Define o estado do jogo
  if (players.length === 1) {
    // Aguardando jogador 1
    socket.send('Aguardando o segundo jogador entrar na sala...');
  } else if (players.length === 2) {
    // Ambos os jogadores conectados, iniciar jogo
    const player1 = players[0];
    const player2 = players[1];
    player1.opponent = player2;
    player2.opponent = player1;

    player1.send('Você é o Jogador 1. Insira um número para o jogador 2 adivinhar.');
    player2.send('Você é o Jogador 2. Aguarde o jogador 1 enviar um número.');


    player1.on('message', (player1Message) => {
      
      if (isNumeric(player1Message)) {
        console.log('msg: ', parseInt(player1Message))
        player2.send('Jogador 2, é sua vez! Tente adivihar o número de 1 a 10 que o jogador 1 inseriu.');

        player2.on('message', (player2Message) => {
          if (isNumeric(player2Message)) {
               if (parseInt(player1Message) === parseInt(player2Message)) {
                 player2.send('Você acertou!');
                 player1.send('O jogador 2 acertou! Você perdeu!');
               } else {
                 player2.send('Você errou. Perdeu o jogo! :(');
                 player1.send('O jogador 2 errou. Você ganhou o jogo!');
               }
            } else {
              player2.send('Por favor, insira um número válido de 1 a 10.');
            }
          });
      }
    })
  }
});

// Função para verificar se uma entrada é numérica
function isNumeric(value) {
  return /^\d+$/.test(value) && parseInt(value) >= 1 && parseInt(value) <= 10;
}
