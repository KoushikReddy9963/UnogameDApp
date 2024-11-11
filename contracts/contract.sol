// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UnoGame {
    address public owner;
    uint public platformFeePercentage;
    bool public bettingOpen = true;
    address[] public players;
    uint public playerCount;
    mapping(address => uint) public bets;
    address public winner;

    event BetPlaced(address indexed player, uint amount);
    event GameStarted();
    event GameEnded(address indexed winner, uint reward);
    event PlatformFeePaid(uint fee);

    constructor(uint _platformFeePercentage) {
        owner = msg.sender;
        platformFeePercentage = _platformFeePercentage;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier bettingIsOpen() {
        require(bettingOpen, "Betting is not open");
        _;
    }

    function openBetting() external onlyOwner {
        bettingOpen = true;
    }
/*
    function closeBetting() external onlyOwner {
        bettingOpen = false;
        emit GameStarted();
    }
*/
    function placeBet() external payable bettingIsOpen {
        require(msg.value > 0, "Bet amount must be greater than zero");
        require(bets[msg.sender] == 0, "Player has already placed a bet");

        players.push(msg.sender);
        bets[msg.sender] = msg.value;
        playerCount += 1; // Increment player count

        emit BetPlaced(msg.sender, msg.value);
    }

    function setWinner(address _winner) external onlyOwner {
        //require(!bettingOpen, "Betting must be closed to set a winner");
        require(bets[_winner] > 0, "Winner must be a valid player");

        winner = _winner;
        uint totalBetPool = address(this).balance;
        uint platformFee = (totalBetPool * platformFeePercentage) / 100;
        uint reward = totalBetPool - platformFee;

        payable(owner).transfer(platformFee);
        payable(winner).transfer(reward);

        emit PlatformFeePaid(platformFee);
        emit GameEnded(winner, reward);

        resetGame();
    }

    function resetGame() private {
        for (uint i = 0; i < players.length; i++) {
            bets[players[i]] = 0;
        }
        delete players;
        playerCount = 0; // Reset player count
        winner = address(0);
    }
}
