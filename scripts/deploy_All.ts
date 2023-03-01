// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// eslint-disable-next-line import/no-extraneous-dependencies
import hre from "hardhat";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  // We get the contract to deploy
  // const DataToChain = await hre.ethers.getContractFactory("DataToChain");
  // const dataTochain = await DataToChain.deploy();
  // await dataTochain.deployed();
  // console.log("DataToChain deployed to:", dataTochain.address);


  // We get the contract to deploy
  // const BasicToken = await hre.ethers.getContractFactory("BasicToken");
  // const basicToken = await BasicToken.deploy("TCP","TCP");
  // await basicToken.deployed();
  // console.log("BasicToken deployed to:", basicToken.address);

  const TcpPosition = await hre.ethers.getContractFactory("TcpPosition");
  const tcpPosition = await TcpPosition.deploy('0xf374f42f32AEd0eb6a423F9A353aFd20d25ECd50','0xC26A2BB245E0bceD2C2a2671391507fae3630846');

  await tcpPosition.deployed();
  console.log("TcpPosition deployed to:", tcpPosition.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
