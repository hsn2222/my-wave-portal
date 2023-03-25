// npx hardhat run scripts/run.js
const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

  // デプロイオーナーの残高確認
  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log(
    "Owner balance:",
    hre.ethers.utils.formatEther(ownerBalance)
  );

  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");

  // 0.1ETHをコントラクトに提供してデプロイする
  const waveContract = await waveContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await waveContract.deployed();
  console.log("Contract deployed to:", waveContract.address);

  // コントラクトの残高を取得し、結果を出力（0.1ETHであることを確認）
  let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  // デプロイオーナーの残高確認
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log(
    "Owner balance:",
    hre.ethers.utils.formatEther(ownerBalance)
  );
  // wave 実施者の残高確認
  let randomPersonBalance = await hre.ethers.provider.getBalance(randomPerson.address);
  console.log(
    "RandomPerson balance:",
    hre.ethers.utils.formatEther(randomPersonBalance)
  );

  /** 1. waves を送るシミュレーションを行う */
  console.log("start wave >>>>>>");
  let waveTxn1 = await waveContract.connect(randomPerson).wave("A message!");
  await waveTxn1.wait();

  // コントラクトの残高から0.0001ETH引かれていることを確認
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  // wave 実施者の残高確認
  randomPersonBalance = await hre.ethers.provider.getBalance(randomPerson.address);
  console.log(
    "RandomPerson balance:",
    hre.ethers.utils.formatEther(randomPersonBalance)
  );
  console.log("<<<<<< end wave");

  /** 2. waves を送るシミュレーションを行う */
  console.log("start wave >>>>>>");
  let waveTxn2 = await waveContract.connect(randomPerson).wave("B message!");
  await waveTxn2.wait();

  // コントラクトの残高から0.0001ETH引かれていることを確認
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  // wave 実施者の残高確認
  randomPersonBalance = await hre.ethers.provider.getBalance(randomPerson.address);
  console.log(
    "RandomPerson balance:",
    hre.ethers.utils.formatEther(randomPersonBalance)
  );
  console.log("<<<<<< end wave");

  let allWaves = await waveContract.getAllWaves();
  console.log(allWaves);
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