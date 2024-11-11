const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const contractInstance = require('./bundle');
let players = [];

// POST endpoint to add a player's data to the array
app.post('/api/players', (req, res) => {
    const { Name, Address } = req.body;
    if (!Name || !Address) {
        return res.status(400).json({ error: 'Name and Address are required' });
    }
    players.push({ Name, Address });
    console.log(players);
    res.status(201).json({ message: 'Player added successfully' });
});



// GET endpoint to get the address by player name
app.get('/api/players/:name', (req, res) => {
    const playerName = req.params.name;
    const player = players.find(p => p.Name === playerName);
    if (!player) {
        return res.status(404).json({ error: 'Player not found' });
    }
    res.json({ Address: player.Address });
});

async function Gamefee() {
  try{
  const platformFeePercentage = await contractInstance.methods.platformFeePercentage().call();
  
  console.log("Platform Fee Percentage:", platformFeePercentage);}
  catch(error){
    console.log(error)
  }}
Gamefee()
app.use(express.static(__dirname + '/public'));
io.on('connection', onConnection);
http.listen(port, () => console.log('listening on port ' + port));

const numRooms = 5;
const maxPeople = 10;

let deck = Array.from({ length: 112 }, (_, i) => i);
require('dotenv').config();
//const express = require('express');
const { Web3 } = require('web3');


app.use(express.json());
SEPOLIA_RPC_URL='https://sepolia.infura.io/v3/be8d335d6a7f47df9d23572a28233647'
PRIVATE_KEY='0xb9433accc50d9f7fd37f0c43540555b86f9f8b3cea1dcff836933c64874a1d1c'
PLATFORM_WALLET='0x734e4CAA42E28D70DB1c2195d8e42dF7F7DB60CF'

CONTRACT_ADDRESS= '0xd829EE05A9A89CD078d97Aa6385c8C999Ce6A9C3'
// Initialize Web3 and the contract
const web3 = new Web3(SEPOLIA_RPC_URL);

provider="https://sepolia.infura.io/v3/be8d335d6a7f47df9d23572a28233647"
const unoGameABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_platformFeePercentage",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "BetPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "winner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "reward",
        "type": "uint256"
      }
    ],
    "name": "GameEnded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "GameStarted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "fee",
        "type": "uint256"
      }
    ],
    "name": "PlatformFeePaid",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "bets",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "bettingOpen",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "openBetting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "platformFeePercentage",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "playerCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "players",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_winner",
        "type": "address"
      }
    ],
    "name": "setWinner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "winner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]; 

// Replace all Wild, Draw2, and Draw4 cards with random number cards
deck = deck.map(num => {
  const type = cardType(num);
  if (type === 'Wild' || type === 'Draw2' || type === 'Draw4') {
    return Math.floor(Math.random() * 8);
  }
  return num;
});
console.log(cardType(98));

let data = [];
for (let i = 1; i <= numRooms; i++) {
  let room = [];
  room['timeout'] = [];
  room['timeout']['id'] = 0;
  room['timeout']['s'] = 10;
  room['deck'] = [];
  room['reverse'] = 0;
  room['turn'] = 0;
  room['cardOnBoard'] = 0;
  room['people'] = 0;
  let players = [];
  for (let j = 0; j < maxPeople; j++) {
    let p = [];
    p['id'] = 0;
    p['name'] = "";
    p['hand'] = [];
    players[j] = p;
  }
  room['players'] = players;
  data['Room_' + i] = room;
}

/**
 * Shuffles all elements in array
 * @function
 * @param {Array} a Array to shuffle
 */
function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
}

/**
 * Given a card number, returns its color
 * @function
 * @param {Number} num Number of the card position in deck
 * @return {String} Card color. Either black, red, yellow, green or blue.
 */
function cardColor(num) {
  let color;
  if (num % 14 === 13) {
    return 'black';
  }
  switch (Math.floor(num / 14)) {
    case 0:
    case 4:
      color = 'red';
      break;
    case 1:
    case 5:
      color = 'yellow';
      break;
    case 2:
    case 6:
      color = 'green';
      break;
    case 3:
    case 7:
      color = 'blue';
      break;
  }
  return color;
}

/**
 * Given a card number, returns its type
 * @function
 * @param {Number} num Number of the card position in deck
 * @return {String} Card type. Either skip, reverse, draw2, draw4, wild or number.
 */
function cardType(num) {
  switch (num % 14) {
    case 10: //Skip
      return 'Skip';
    case 11: //Reverse
      return 'Reverse';
    case 12: //Draw 2
      return 'Draw2';
    case 13: //Wild or Wild Draw 4
      if (Math.floor(num / 14) >= 4) {
        return 'Draw4';
      } else {
        return 'Wild';
      }
    default:
      return 'Number ' + (num % 14);
  }
}

/**
 * Given a card number, returns its scoring
 * @function
 * @param {Number} num Number of the card position in deck
 * @return {Number} Points value.
 */
function cardScore(num) {
  let points;
  switch (num % 14) {
    case 10: //Skip
    case 11: //Reverse
    case 12: //Draw 2
      points = 20;
      break;
    case 13: //Wild or Wild Draw 4
      points = 50;
      break;
    default:
      points = num % 14;
      break;
  }
  return points;
}

/**
 * Starts a countdown for start a game on a room
 * @function
 * @param {String} name Room name
 */
function startingCountdown(name) {
  let countDown = data[name]['timeout']['s']--;
  io.to(name).emit('countDown', countDown);
  console.log('>> ' + name + ': Starting in ' + countDown);
  if (countDown <= 0) {
    clearInterval(data[name]['timeout']['id']);
    startGame(name);
  }
}

/**
 * Request for start the game.
 * @param {String} name Room name
 */
function startGame(name) {
  console.log('>> ' + name + ': Requesting game...');
  let people;
  try {
    people = io.sockets.adapter.rooms[name].length;
  } catch (e) {
    console.log('>> ' + name + ': No people here...');
    return;
  }
  if (people >= 2) {
    console.log('>> ' + name + ': Starting');
    let sockets_ids = Object.keys(io.sockets.adapter.rooms[name].sockets);
    for (let i = 0; i < people; i++) {
      data[name]['players'][i]['id'] = sockets_ids[i];
      let playerName = io.sockets.sockets[sockets_ids[i]].playerName;
      data[name]['players'][i]['name'] = playerName;
      console.log('>> ' + name + ': ' + playerName +
        ' (' + sockets_ids[i] + ') is Player ' + i);
    }

    data[name]['people'] = people;

    //Shuffle a copy of a new deck
    let newDeck = [...deck];
    shuffle(newDeck);
    data[name]['deck'] = newDeck;
    console.log('>> ' + name + ': Shuffling deck');

    //Every player draws a card.
    //Player with the highest point value is the dealer.
    let scores = new Array(people);
    do {
      console.log('>> ' + name + ': Deciding dealer');
      for (let i = 0, card = 0, score = 0; i < people; i++) {
        card = parseInt(newDeck.shift());
        newDeck.push(card);
        score = cardScore(card);
        console.log('>> ' + name + ': Player ' + i + ' draws ' + cardType(card) +
          ' ' + cardColor(card) + ' and gets ' + score + ' points');
        scores[i] = score;
      }
    } while (new Set(scores).size !== scores.length);
    let dealer = scores.indexOf(Math.max(...scores));
    console.log('>> ' + name + ': The dealer is Player ' + dealer);

    //Each player is dealt 7 cards
    for (let i = 0, card = 0; i < people * 7; i++) {
      let player = (i + dealer + 1) % people;
      card = parseInt(newDeck.shift());
      data[name]['players'][player]['hand'].push(card);
      console.log('>> ' + name + ': Player ' + player + ' draws '
        + cardType(card) + ' ' + cardColor(card));
    }

    let cardOnBoard;
    do {
      cardOnBoard = parseInt(newDeck.shift());
      console.log('>> ' + name + ': Card on board ' +
        cardType(cardOnBoard) + ' ' + cardColor(cardOnBoard));
      if (cardColor(cardOnBoard) === 'black') {
        newDeck.push(cardOnBoard);
        console.log('>> ' + name + ': Replacing for another card');
      } else {
        break;
      }
    } while (true);
    data[name]['cardOnBoard'] = cardOnBoard;

    data[name]['turn'] = (dealer + 1) % people;
    data[name]['reverse'] = 0;

    if (cardType(cardOnBoard) === 'Draw2') {
      card = parseInt(newDeck.shift());
      data[name]['players'][(data[name]['turn'])]['hand'].push(card);
      console.log('>> ' + name + ': Player ' + (dealer + 1 % people) +
        ' draws ' + cardType(card) + ' ' + cardColor(card));
      card = parseInt(newDeck.shift());
      data[name]['players'][(data[name]['turn'])]['hand'].push(card);
      console.log('>> ' + name + ': Player ' + (dealer + 1 % people) +
        ' draws ' + cardType(card) + ' ' + cardColor(card));

      data[name]['turn'] = (dealer + 2) % people;
    } else if (cardType(cardOnBoard) === 'Reverse') {
      data[name]['turn'] = Math.abs(dealer - 1) % people;
      data[name]['reverse'] = 1;
    } else if (cardType(cardOnBoard) === 'Skip') {
      data[name]['turn'] = (dealer + 2) % people;
    }

    console.log('>> ' + name + ': Turn is for ' + data[name]['players'][(data[name]['turn'])]['name']);
    console.log('>> ' + name + ': Reverse (' + (!!data[name]['reverse']) + ')');

    for (let i = 0; i < people; i++) {
      io.to(data[name]['players'][i]['id']).emit('haveCard', data[name]['players'][i]['hand']);
    }
    io.to(name).emit('turnPlayer', data[name]['players'][(data[name]['turn'])]['id']);
    io.to(name).emit('sendCard', data[name]['cardOnBoard']);
  } else {
    console.log('>> ' + name + ': Not enough people...');
  }
}

/**
 * Whenever a client connects
 * @function
 * @param {Socket} socket Client socket
 */
function onConnection(socket) {

  /**
   * Whenever a room is requested, looks for a slot for the player,
   * upto 10 players in a room, maxRooms and started games are respected.
   * @method
   * @param {String} playerName Player name
   * @return responseRoom with name of the room, otherwise error.
   */
  socket.on('requestRoom', function (playerName) {
    socket.playerName = playerName;
    for (let i = 1; i <= numRooms; i++) {
      let name = 'Room_' + i;
      let people;
      try {
        people = io.sockets.adapter.rooms[name].length;
      } catch (e) {
        people = 0;
      }

      if (people < maxPeople && data[name]['timeout']['s'] > 0) {
        socket.join(name);
        console.log('>> User ' + socket.playerName +
          ' connected on ' + name + ' (' + (people + 1) + '/' + maxPeople + ')');
        io.to(name).emit('responseRoom', [name, people + 1, maxPeople]);
        if (people + 1 >= 2) {
          clearInterval(data[name]['timeout']['id']);
          data[name]['timeout']['s'] = 3;
          data[name]['timeout']['id'] = setInterval(function () {
            startingCountdown(name);
          }, 1000);
        }
        return;
      }
    }
    io.to(socket.id).emit('responseRoom', 'error');
    console.log('>> Rooms exceeded');
  });

  /**
   * Whenever someone is performing a disconnection,
   * leave its room and notify to the rest
   * @method
   */
  //// TODO: Empty a room
  socket.on('disconnecting', function () {
    room = Object.keys(io.sockets.adapter.sids[socket.id])[1];
    if (room !== undefined) {
      clearInterval(data[room]['timeout']['id']);
      io.to(room).emit('playerDisconnect', room);
      console.log('>> ' + room + ': Player ' + socket.playerName + ' (' +
        socket.id + ') leaves the room');
    }
  });

  /**
   * Whenever disconnection is completed
   * @method
   */
  socket.on('disconnect', function () {
    console.log('>> Player ' + socket.playerName + ' (' +
      socket.id + ') disconnected');
  });

  socket.on('drawCard', function (res) {
    let numPlayer = data[res[1]]['turn'];
    let idPlayer = data[res[1]]['players'][numPlayer]['id'];
    let namePlayer = data[res[1]]['players']['name'];
    let handPlayer = data[res[1]]['players'][numPlayer]['hand'];
    let deck = data[res[1]]['deck'];

    if (idPlayer === socket.id) {
      let card = parseInt(deck.shift());
      handPlayer.push(card);
      io.to(idPlayer).emit('haveCard', handPlayer);
      //deck.push(card);
      // TODO: Check playable card
      //Next turn
      numPlayer = Math.abs(numPlayer + (-1) ** data[res[1]]['reverse']) % data[res[1]]['people'];
      data[res[1]]['turn'] = numPlayer;
      io.to(res[1]).emit('turnPlayer', data[res[1]]['players'][numPlayer]['id']);
    }
  });

  socket.on('playCard', function (res) {
    let numPlayer = data[res[1]]['turn'];
    let idPlayer = data[res[1]]['players'][numPlayer]['id'];
    let namePlayer = data[res[1]]['players'][numPlayer]['name'];
    let handPlayer = data[res[1]]['players'][numPlayer]['hand'];
    let deck = data[res[1]]['deck'];

    if (idPlayer === socket.id) {
      let playedColor = cardColor(res[0]);
      let playedNumber = res[0] % 14;

      let boardColor = cardColor(data[res[1]]['cardOnBoard']);
      let boardNumber = data[res[1]]['cardOnBoard'] % 14;

      if (playedColor === 'black' || playedColor === boardColor || playedNumber === boardNumber) {
        // Play card
        io.to(res[1]).emit('sendCard', res[0]);
        data[res[1]]['cardOnBoard'] = res[0];

        // Remove card
        let cardPos = handPlayer.indexOf(res[0]);
        if (cardPos > -1) {
          handPlayer.splice(cardPos, 1);
        }
        io.to(idPlayer).emit('haveCard', handPlayer);

        // Check if the player has won
        if (handPlayer.length === 0) {
          console.log(`Player ${namePlayer} wins the game!`);
          io.to(res[1]).emit('gameOver', { winner: namePlayer }); // Notify clients about the winner
          return; // End the game for this room
        }

        // Next turn logic
        let skip = 0;
        if (cardType(res[0]) === 'Skip') {
          skip += 1;
        } else if (cardType(res[0]) === 'Reverse') {
          data[res[1]]['reverse'] = (data[res[1]]['reverse'] + 1) % 2;
        } else if (cardType(res[0]) === 'Draw2') {
          skip += 1;
          // Handle Draw2 card logic here
        } else if (cardType(res[0]) === 'Draw4') {
          skip += 1;
          // Handle Draw4 card logic here
        }

        // Calculate the next player's turn
        numPlayer = Math.abs(numPlayer + (-1) ** data[res[1]]['reverse'] * (1 + skip)) % data[res[1]]['people'];
        data[res[1]]['turn'] = numPlayer;
        io.to(res[1]).emit('turnPlayer', data[res[1]]['players'][numPlayer]['id']);
      }
    }
  });

}
