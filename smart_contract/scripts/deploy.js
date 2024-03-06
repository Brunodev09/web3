
const main = async () => {
  const Transactions = await hre.ethers.getContractFactory('Transactions');
  const transactions = await Transactions.deploy(); 

  await transactions.waitForDeployment();
  const address = await transactions.getAddress();
  console.log(`Transactions contract deployed to: ${address}`);
}

const init = async () => {
  try {
    await main();
    process.exit(0);
  } catch (ex) {
    console.log(ex);
    process.exit(1);
  }
}

init();
