import { ethers } from 'hardhat';

async function main() {
  const ContractFactory = await ethers.getContractFactory('Faucet');

  const instance = await ContractFactory.deploy();
  await instance.deployed();

  console.log('Contract deployed at ' + instance.address);
  console.log('Transaction: ' + instance.deployTransaction.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});