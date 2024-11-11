//const contractInstance = require("./bundle");
//const contractInstance = require("./bundle");

//const { provider, provider } = require("../bundle");

//let contractInstance
const socket = io({ autoConnect: false });
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


const cdWidth = 240;
const cdHeight = 360;
const cards = new Image();
const back = new Image();

let room;
let hand = [];
let turn;
// let playerName;

let web3;
let contractInstance//import { contractInstance } from "./bundle";;
let playerName;

// Contract details
const ownerPrivateKey = '0xb9433accc50d9f7fd37f0c43540555b86f9f8b3cea1dcff836933c64874a1d1c';
const ownerAddress = '0x734e4CAA42E28D70DB1c2195d8e42dF7F7DB60CF';
const unoGameAddress = '0xA496618F60dc9f2d67A84571de97daEF6552698f';
SEPOLIA_RPC_URL='https://sepolia.infura.io/v3/be8d335d6a7f47df9d23572a28233647'
// Verify the derived owner address
 
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
const provider = new Web3.providers.HttpProvider(SEPOLIA_RPC_URL); 
const ownerWeb3 = new Web3(provider); 
const ownerContract = new ownerWeb3.eth.Contract(unoGameABI, unoGameAddress);



const derivedOwnerAddress = ownerWeb3.eth.accounts.privateKeyToAccount(ownerPrivateKey).address;
console.log("Derived Owner Address:", derivedOwnerAddress)


//unoGameContract = new web3.eth.Contract(unoGameABI, unoGameAddress);

//let addresses=[]
async function init() {
  ctx.font = "12px Arial";
  canvas.style.backgroundColor = '#10ac84';
  cards.src = 'images/deck.svg';
  back.src = 'images/uno.svg';

  document.addEventListener('touchstart', onMouseClick, false);
  document.addEventListener('click', onMouseClick, false);

  playerName = promptPlayerName();
  const playerCookie = getCookie('playerInfo');

  playerName = getCookie('playerName') || promptPlayerName();
  setCookie('playerName', playerName, 24 * 3600);
  /*let Name=playerName
  let Address="   "
  setCookie('playerInfo', { playerAddress: Address, playerName:Name }, 24 * 3600);
  let playerInfo=getCookie('playerInfo')
  console.log(playerInfo.playerAddress,playerInfo.playerName)*/

  await connectToMetaMask();
  
}

function promptPlayerName() {
  let defaultName = 'Player' + Math.floor(1000 + Math.random() * 9000);
  return prompt('Enter your name:', defaultName) || defaultName;
}

async function connectToMetaMask() {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    web3 = new Web3(window.ethereum);
   
    const accounts = await web3.eth.getAccounts();
    const playerAddress = accounts[0];
    const balanceWei = await web3.eth.getBalance(playerAddress);
    const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
    console.log(`Player's balance: ${balanceEther} ETH`);
    playerName = getCookie('playerName') || promptPlayerName();
     
    // Update cookie with playerAddress and playerName
    let Name=playerName
    console.log(Name)
    let Address=playerAddress
    console.log(Address)
    let Info={  Address, Name }
   // addPlayer(playerName,Address)
    console.log(Info)
    setCookie('playerInfo', Info, 24 * 3600);
    document.cookie = 'playerInfo=' + JSON.stringify(Info);
    let playerInfo=getCookie('playerInfo')
    playerInfo = JSON.parse(playerInfo);
    console.log(playerInfo)
    
    console.log()
    console.log(playerInfo.Address,playerInfo.Name)
  
    //setCookie('playerName', playerName, 24 * 3600);  // Store for 24 hours
    //setPlayerInfo(playerName, playerAddress)
    //printAllPlayers
   contractInstance = new web3.eth.Contract(unoGameABI, unoGameAddress);

    try {
      await initializeGame(balanceEther, playerAddress, balanceWei);
       
    } catch (error) {
      console.error("Error initializing the game:", error);
    }
  } else {
    alert('MetaMask is not installed. Please install MetaMask to play.');
  }
}

async function initializeGame(balanceEther, playerAddress, balanceWei) {
  const platformFeePercentage = await contractInstance.methods.platformFeePercentage().call();
  console.log("Platform Fee Percentage:", platformFeePercentage);
  g=await ownerContract.methods.owner().call()
  console.log(g)
  /*let winnerAddress="0x734e4CAA42E28D70DB1c2195d8e42dF7F7DB60CF"
  try{
  const gasEstimate = await ownerContract.methods.setWinner(winnerAddress).estimateGas();
  console.log(gasEstimate)}
  catch(err){
    console.log(err)
  }
  try{
    const gasEstimate = await ownerContract.methods.setWinner(winnerAddress).estimateGas({from:derivedOwnerAddress});
    console.log(gasEstimate)}
    catch(err){
      console.log(err)
    }*/
  g=await contractInstance.methods.owner().call()
  console.log(g)
  const bettingOpen = await contractInstance.methods.bettingOpen().call();

  if (bettingOpen) {
    let betAmountInput = prompt(`Your balance: ${balanceEther} ETH\nEnter your bet amount in Ether:`);
    const betAmount = web3.utils.toWei(betAmountInput, 'ether');

    if (parseFloat(betAmount) > parseFloat(balanceWei)) {
      alert('Insufficient balance for the bet amount.');
      return;
    }
    let playerInfo=getCookie('playerInfo')
    playerInfo = JSON.parse(playerInfo);
    var g=await contractInstance.methods.bets(playerInfo.Address).call()
    console.log(g);

    if(g > 0)
    {
      socket.connect();
    }
   

    try {
      const result = await contractInstance.methods.placeBet().send({ from: playerAddress, value: betAmount });
      console.log('Bet placed:', result);

      socket.connect();
      console.log('Socket connected');
    } catch (error) {
      console.error('Error placing bet:', error);
      alert('Failed to place bet on the blockchain.');
    }
  } else {
    alert('Betting is closed at the moment. Please try again later.');
  }
}
//===============
// Function to add player data
function addPlayer(Name, Address) {
  fetch('http://localhost:3000/api/players', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ Name, Address }),
  })
  .then(response => response.json())
  .then(data => console.log('Player added:', data))
  .catch(error => console.error('Error:', error));
}

// Function to get a player's address by name
function getPlayerAddress(playerName) {
  fetch(`http://localhost:3000/api/players/${playerName}`)
  .then(response => {
      if (!response.ok) {
          throw new Error('Player not found');
      }
      return response.json();
  })
  .then(data => console.log('Player address:', data.Address))
  .catch(error => console.error('Error:', error));
}

//==================

function setCookie(name, value, seconds) {
  let date = new Date();
  date.setTime(date.getTime() + (seconds * 1000));
  let expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function setPlayerInfo(playerName, playerAddress) {
  let playerInfo = { playerName: playerName, playerAddress: playerAddress };
  let existingPlayers = getCookie('players');
  
  if (existingPlayers) {
    existingPlayers = JSON.parse(existingPlayers);
  } else {
    existingPlayers = [];
  }

  existingPlayers.push(playerInfo);
  setCookie('players', JSON.stringify(existingPlayers), 24 * 3600);  // Store for 24 hours
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

function printAllPlayers() {
  let players = getCookie('players');
  if (players) {
    players = JSON.parse(players);
    players.forEach(player => {
      console.log(`Player Name: ${player.playerName}, Player Address: ${player.playerAddress}`);
    });
  } else {
    console.log('No players found in cookies.');
  }
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

async function declareWinner() {
  // Display the winner on the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.fillStyle = 'green';
  ctx.font = 'bold 30px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(playerName + ' wins!', canvas.width / 2, canvas.height / 2);
  let playerInfo=getCookie('playerInfo')
  playerInfo = JSON.parse(playerInfo);
  if(playerName===playerInfo.Name){
    console.log("Mama");
   await callOnlyOwnerFunction(playerInfo.Address)
    console.log("Mama 2");
  }
  else{
    console.log("Ramesh");
  }
  // Send a message to all players in the room
  //setwinnner()
 // g=  getPlayerAddress(playerName)
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
/*
async  function setwinnner(){
try {
  // Assuming you already have an instance of the smart contract deployed on the network.
  //const contractInstance = new web3.eth.Contract(unoGameABI,unoGameAddress);

  // Here we assume you have the owner address and the necessary private key for signing
  const gasPrice = web3.utils.toWei('20', 'gwei'); // Set gas price in wei
  const gasLimit = 200000; // Set gas limit based on the function requirements

  // Sending the transaction to close betting
  const tx = {
    from: ownerAddress,
    to: unoGameAddress,
    gas: gasLimit,
    gasPrice: gasPrice,
    data: methods.setWinner(playerAddress).encodeABI()
  };

  const signedTx = await web3.eth.accounts.signTransaction(tx, ownerPrivateKey);

  // Send the signed transaction to the network
 const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  console.log('Betting closed on the contract: ', receipt);
  return receipt; // Resolving the promise once the betting is closed
} catch (err) {
  console.error('Error closing betting on the contract:', err);
  throw err; // Throwing the error to be handled by the caller function
}}*/


async function signAndSendTransactionWithOwner(data, gasLimit) {
  const tx = {
    to: unoGameAddress,
    data,
    gas: gasLimit,
  };
  console.log("in sign mama");
  const signedTx = await ownerWeb3.eth.accounts.signTransaction(tx, ownerPrivateKey);
  console.log("sign end mama");
  return ownerWeb3.eth.sendSignedTransaction(signedTx.rawTransaction);
}
// Function to call onlyOwner functions
async function callOnlyOwnerFunction(winnerAddress) {

  console.log("i am in call mama");
  const data = ownerContract.methods.setWinner(winnerAddress).encodeABI();
  const gasEstimate = await ownerContract.methods.setWinner(winnerAddress).estimateGas({from:derivedOwnerAddress});

  try {
    console.log("mama in call");
    const receipt = await signAndSendTransactionWithOwner(data, gasEstimate);
    console.log("end mama");
    console.log('Transaction successful:', receipt);
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}
init();
