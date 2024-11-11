const socket = io({ autoConnect: false });
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
import contractInstance from './bundle.js';
const cdWidth = 240;
const cdHeight = 360;
const cards = new Image();
const back = new Image();

let room;
let hand = [];
let turn;
let playerName;

function init() {
  ctx.font = "12px Arial";
  canvas.style.backgroundColor = '#10ac84';
  cards.src = 'images/deck.svg';
  back.src = 'images/uno.svg';

  document.addEventListener('touchstart', onMouseClick, false);
  document.addEventListener('click', onMouseClick, false);

  playerName = getCookie('playerName');
  if (playerName == null) {
    let defaultName = 'Player' + Math.floor(1000 + Math.random() * 9000);
    playerName = prompt('Enter your name: ', defaultName);
    if (playerName === null || playerName === "") {
      playerName = defaultName;
    } else {
      setCookie('playerName', playerName, 24 * 3600);
    }
  }
  
  placeBet()

  socket.connect();
}
async function connectToMetaMask() {
  try {
      // Request account access from MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      //Initialize Web3 with MetaMask's provider
      window.web3 = new Web3(window.ethereum);
      console.log('Connected to MetaMask with account:', account);
      return account;
  } catch (error) {
      console.error('User rejected MetaMask connection:', error);
      alert('MetaMask connection failed. Please try again.');
      return null;
  }
}
/*
async function placeBet(betAmount) {
  try {const account = await connectToMetaMask();
  if (!account) return; // Exit if MetaMask connection fails
      //const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const playerAddress = account;
     // betAmount=prompt(`Enter your bet amount in Ether:`);
     betAmount='0.01'
      const betInWei = web3.utils.toWei(betAmount, 'ether');
      //const message = `I am placing a bet of ${betAmount} Ether`;
      console.log
      // Ask MetaMask to sign the message
      //const signature = await web3.eth.personal.sign(message, playerAddress);
      
      // Send the signed message, bet amount, and player address to the server
      const response = await fetch('/placeBet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerAddress, betAmount: betInWei })
      });

      const result = await response.json();
      console.log(result.message);
  } catch (error) {
      console.error("Failed to place bet:", error);
  }
}*/
/*
async function placeBet(betAmount) {
  try {const account = await connectToMetaMask();
  if (!account) return; // Exit if MetaMask connection fails
      //const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const playerAddress = account;
      betAmount=prompt(`Enter your bet amount in Ether:`);
      const betInWei = web3.utils.toWei(betAmount, 'ether');
      const message = `I am placing a bet of ${betAmount} Ether`;
      
      // Ask MetaMask to sign the message
      const signature = await web3.eth.personal.sign(message, playerAddress);
      
      // Send the signed message, bet amount, and player address to the server
      const response = await fetch('/placeBet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerAddress, betAmount: betInWei, message, signature })
      });

      const result = await response.json();
      console.log(result.message);
  } catch (error) {
      console.error("Failed to place bet:", error);
  }
}*/
/*
// Function to place a bet
async function placeBet() {
  const account = await connectToMetaMask();
  if (!account) return; // Exit if MetaMask connection fails

  try {
    //const balanceWei = await web3.eth.getBalance(account);
    //const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
    let betAmountInput = prompt(`Enter your bet amount in Ether:`);

      // Convert bet amount to Wei (1 Ether = 10^18 Wei)
      //const betAmountWei = window.web3.utils.toWei(betAmountInput.toString(), 'ether');
      // console.log(betAmountWei)
      // Send request to the server to place the bet
      const response = await fetch('/placeBet', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              playerAddress: account,
              betAmount: betAmountInput, // Server expects value in Ether; server.js will handle conversion to Wei
          }),
      });

      const data = await response.json();
      if (response.ok) {
          alert('Bet placed successfully!');
          //console.log('Bet receipt:', data.receipt);
      } else {
          alert('Failed to place bet: ' + data.error);
          console.error('Error:', data.error);
      }
  } catch (error) {
      console.error('Failed to place bet:', error);
      alert('An error occurred while placing the bet. Please try again.');
  }
}*/
function setCookie(name, value, seconds) {
  let date = new Date();
  date.setTime(date.getTime() + (seconds * 1000));
  let expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  name += "=";
  let cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}

socket.on('connect', requestRoom);
socket.on('confirmLeave', requestRoom);

function requestRoom() {
  dialog('Waiting for a Room...');
  socket.emit('requestRoom', playerName);
  room = 0;
  hand = [];
  turn = false;
  console.log('>> Room Request', playerName);
}

socket.on('responseRoom', function ([name, people, maxPeople]) {
  if (name !== 'error') {
    room = name;
    console.log('<< Room Response', name);
    // ctx.fillText(name, 0, 10);
    // ctx.drawImage(back, canvas.width-cdWidth/2-60, canvas.height/2-cdHeight/4, cdWidth/2, cdHeight/2);
    // ctx.fillText(playerName, 100, 390);
    dialog(name + ': Waiting for Players (' + people + '/' + maxPeople + ')');
  } else {
    socket.disconnect();
    alert('Rooms are full! Try again later');
  }
});

socket.on('countDown', function (countDown) {
  if (countDown > 0) {
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'orange';
    ctx.fillRect(canvas.width / 2 - 10, canvas.height / 2 + 40, 21, 20);
    ctx.fillStyle = 'black';
    ctx.fillText(countDown, canvas.width / 2, canvas.height / 2 + 50);
  } else {
    const width = 800;
    const height = 250;
    ctx.clearRect(canvas.width / 2 - width / 2, canvas.height / 2 - height / 2, width, height);
    ctx.drawImage(back, canvas.width - cdWidth / 2 - 60, canvas.height / 2 - cdHeight / 4, cdWidth / 2, cdHeight / 2);
    ctx.font = 'normal 15px sans-serif';
    ctx.fillText(playerName, 100, 390);
  }
});

socket.on('playerDisconnect', function () {
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  //socket.emit('leaveRoom', room);
  console.log('<< Player disconnected', room);
});

function onMouseClick(e) {

  const offsetY = parseInt(window.getComputedStyle(canvas).marginTop);
  const offsetX = parseInt(window.getComputedStyle(canvas).marginLeft);
  const X = e.pageX - offsetX;
  const Y = e.pageY - offsetY;

  let lastCard = (hand.length / 112) * (cdWidth / 3) + (canvas.width / (2 + (hand.length - 1))) * (hand.length) - (cdWidth / 4) + cdWidth / 2;
  let initCard = 2 + (hand.length / 112) * (cdWidth / 3) + (canvas.width / (2 + (hand.length - 1))) - (cdWidth / 4);

  if (Y >= 400 && Y <= 580 && X >= initCard && X <= lastCard) {
    for (let i = 0, pos = initCard; i < hand.length; i++, pos += canvas.width / (2 + (hand.length - 1))) {
      if (X >= pos && X <= pos + canvas.width / (2 + (hand.length - 1))) {
        // debugArea(pos, pos+canvas.width/(2+(hand.length-1)), 400, 580);
        socket.emit('playCard', [hand[i], room]);
        return;
      }
    }
  } else if (X >= canvas.width - cdWidth / 2 - 60 && X <= canvas.width - 60 &&
    Y >= canvas.height / 2 - cdHeight / 4 && Y <= canvas.height / 2 + cdHeight / 4) {
    socket.emit('drawCard', [1, room]);
  }
}

socket.on('turnPlayer', function (data) {
  if (data === socket.id) {
    turn = true;
    console.log('<< Your turn');
    arrow();
  } else {
    turn = false;
    console.log('<< Not your turn');
  }
});

socket.on('haveCard', function (nums) {
  hand = nums;
  ctx.clearRect(0, 400, canvas.width, canvas.height);

  // Draw each card in hand
  for (let i = 0; i < hand.length; i++) {
    ctx.drawImage(
      cards,
      1 + cdWidth * (hand[i] % 14),
      1 + cdHeight * Math.floor(hand[i] / 14),
      cdWidth,
      cdHeight,
      (hand.length / 112) * (cdWidth / 3) + (canvas.width / (2 + (hand.length - 1))) * (i + 1) - (cdWidth / 4),
      400,
      cdWidth / 2,
      cdHeight / 2
    );
    console.log('<< Have card', hand[i]);
  }

  // Check if the player has no cards left
  if (hand.length === 0) {
    declareWinner();
  }
});

function declareWinner() {
  // Display the winner on the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.fillStyle = 'green';
  ctx.font = 'bold 30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(playerName + ' wins!', canvas.width / 2, canvas.height / 2);

  // Send a message to all players in the room
  socket.emit('gameOver', { winner: playerName, room: room });
}

// Handle game over on all clients
socket.on('gameOver', function (data) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'green';
  ctx.font = 'bold 30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(data.winner + ' wins the game!', canvas.width / 2, canvas.height / 2);
});


socket.on('sendCard', function (num) {
  ctx.drawImage(cards, 1 + cdWidth * (num % 14), 1 + cdHeight * Math.floor(num / 14), cdWidth, cdHeight, canvas.width / 2 - cdWidth / 4, canvas.height / 2 - cdHeight / 4, cdWidth / 2, cdHeight / 2);
});

function debugArea(x1, x2, y1, y2) {
  ctx.beginPath();
  ctx.moveTo(0, y1);
  ctx.lineTo(canvas.width, y1);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, y2);
  ctx.lineTo(canvas.width, y2);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x1, 0);
  ctx.lineTo(x1, canvas.height);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x2, 0);
  ctx.lineTo(x2, canvas.height);
  ctx.closePath();
  ctx.stroke();
}

function chooseColor() {

  let cx = canvas.width / 2;
  let cy = canvas.height / 2;
  let r = cdHeight / 4;
  let colors = ['red', 'blue', 'green', 'gold'];

  for (let i = 0; i < 4; i++) {
    let startAngle = i * Math.PI / 2;
    let endAngle = startAngle + Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText("Choose a color", canvas.width / 2, canvas.height / 2 - r - 10);
  ctx.textAlign = 'start';
}

function dialog(text) {
  const width = 800;
  const height = 250;
  ctx.fillStyle = 'orange';
  ctx.fillRect(canvas.width / 2 - width / 2, canvas.height / 2 - height / 2, width, height);
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'normal 15px sans-serif';
  ctx.fillText(playerName, canvas.width / 2, canvas.height / 2 - 50);
  ctx.font = 'normal bold 20px sans-serif';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function arrow() {
  const x = 100;
  const y = 350;
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(x - 5, y - 10, 10, 20);
  ctx.beginPath();
  ctx.moveTo(x - 15, y + 10);
  ctx.lineTo(x + 15, y + 10);
  ctx.lineTo(x, y + 30);
  ctx.fill();

}

init();
