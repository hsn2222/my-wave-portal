// npx hardhat run scripts/run.js
const main = async () => {
  const [owner, randomPerson1, randomPerson2] = await hre.ethers.getSigners();
  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  const wavePortal = await waveContract.deployed();

  console.log("Contract deployed to:", wavePortal.address);
  console.log("Contract deployed by:", owner.address);

  let waveCount;
  waveCount = await waveContract.getTotalWaves();

  // デプロイアカウントでwave
  let waveTxn = await waveContract.wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  // ランダムアカウント1でwave
  console.log("Random account:", randomPerson1.address);
  waveTxn = await waveContract.connect(randomPerson1).wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();

  // ランダムアカウント2でwave
  console.log("Random account:", randomPerson2.address);
  waveTxn = await waveContract.connect(randomPerson2).wave();
  await waveTxn.wait();

  waveCount = await waveContract.getTotalWaves();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();