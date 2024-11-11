const hre = require("hardhat");

async function main() {
    const platformFee = 5; // 5% fee

    // Get the contract to deploy
    const UnoGame = await hre.ethers.getContractFactory("UnoGame");
    const unoGame = await UnoGame.deploy(platformFee);

    // Wait for the contract deployment to be mined
    await unoGame.deployTransaction;

    console.log("UnoGame deployed to:", unoGame.target);
}

// Run the deployment script
main().catch((error) => {
    console.error("Deployment failed:", error);
    process.exitCode = 1;
});