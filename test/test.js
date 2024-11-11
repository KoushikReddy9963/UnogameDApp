const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UnoGame Contract", function () {
  let unoGame;
  let owner, player1, player2, player3, player4;
  const platformFeePercentage = 5;

  before(async function () {
    [owner, player1, player2, player3, player4] = await ethers.getSigners();

    const UnoGame = await ethers.getContractFactory("UnoGame");
    unoGame = await UnoGame.deploy(platformFeePercentage);
  });

  it("should set the correct owner and platform fee", async function () {
    expect(await unoGame.owner()).to.equal(owner.address);
    expect(await unoGame.platformFeePercentage()).to.equal(platformFeePercentage);
  });

  it("should allow players to place bets", async function () {
    await unoGame.connect(player1).placeBet({ value: "1000000000000000000" });
    await unoGame.connect(player2).placeBet({ value: "1500000000000000000" });
    await unoGame.connect(player3).placeBet({ value: "2000000000000000000" });
    await unoGame.connect(player4).placeBet({ value: "2500000000000000000" });

    expect(await unoGame.playerCount()).to.equal(4);
    expect(await unoGame.bets(player1.address)).to.equal("1000000000000000000");
    expect(await unoGame.bets(player2.address)).to.equal("1500000000000000000");
    expect(await unoGame.bets(player3.address)).to.equal("2000000000000000000");
    expect(await unoGame.bets(player4.address)).to.equal("2500000000000000000");
  });

  it("should set the winner and distribute rewards", async function () {
    await unoGame.connect(owner).setWinner(player1.address); // Ensures player1 is recognized as a valid player

    const totalBetPool = await ethers.provider.getBalance(unoGame.address);
    const platformFee = totalBetPool.mul(platformFeePercentage).div(100);
    const reward = totalBetPool.sub(platformFee);

    // Expect owner and winner balances to include their new balances
    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
    const player1BalanceBefore = await ethers.provider.getBalance(player1.address);

    expect(await ethers.provider.getBalance(owner.address)).to.equal(ownerBalanceBefore.add(platformFee));
    expect(await ethers.provider.getBalance(player1.address)).to.equal(player1BalanceBefore.add(reward));
  });


  it("should reset the game after setting the winner", async function () {
    expect(await unoGame.playerCount()).to.equal(0);
    expect(await unoGame.winner()).to.equal(ethers.constants.AddressZero);
  });
});