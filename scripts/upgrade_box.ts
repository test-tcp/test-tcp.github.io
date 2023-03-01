// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// eslint-disable-next-line import/no-extraneous-dependencies
import { ethers, upgrades,config } from "hardhat";
import { HardhatNetworkAccountsConfig, HardhatNetworkHDAccountsConfig } from "hardhat/types";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const accounts = config.networks.hardhat.accounts as HardhatNetworkHDAccountsConfig;
  console.log(accounts)
  const index = 1; // first wallet, increment for next wallets
  const wallet1 = ethers.Wallet.fromMnemonic(accounts.mnemonic, accounts.path + `/${index}`);
  
  const privateKey1 = wallet1.privateKey
  console.log(privateKey1)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
