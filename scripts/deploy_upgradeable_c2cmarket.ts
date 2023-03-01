// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// eslint-disable-next-line import/no-extraneous-dependencies
import { ethers, upgrades } from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // const ERC20Template = await hre.ethers.getContractFactory("ERC20Template");
  // const usdt = await ERC20Template.deploy("USDT","USDT");
  // await usdt.deployed();
  // console.log("usdt deployed to:", usdt.address);

  
  // const tcp = await ERC20Template.deploy("TCP","TCP");
  // await tcp.deployed();
  // console.log("tcp deployed to:", tcp.address);

  const C2CMarketUpgradeable = await ethers.getContractFactory("C2CMarketUpgradeable");
  console.log("Deploying C2CMarketUpgradeable...");
  const market = await upgrades.deployProxy(C2CMarketUpgradeable, [], { initializer: "initialize" });
  await market.deployed();
  console.log("C2CMarketUpgradeable deployed to:", market.address);


  // console.log("Upgrading C2CMarket...");
  // await upgrades.upgradeProxy("0x5FC8d32690cc91D4c39d9d3abcBD16989F875707", C2CMarketUpgradeable);
  // console.log("C2CMarket upgraded");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
