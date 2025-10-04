// 这个脚本用来部署 FundMe 合约


// import  ethers
// create main function
   // init 2 accounts
   // fund contract with first account
   // check balance of contract
   // fund contract with second account
   // check balance of contract 
   // check mapping fundersToAmount
// execute main function


const {ethers} = require("hardhat")


async function main() {
    // create factory
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log("contract is deploying")
    // depoly contracts from factory
    const fundMe =  await fundMeFactory.deploy(300)
    await fundMe.waitForDeployment() // 等待入块
    // console.log("contract has been depolyed successfully , contract address is " + fundMe.target);
    console.log(`contract has been depolyed successfully , contract address is  ${fundMe.target}`);

    // 这里网络原因暂时不去verify 所以注释掉
    // if(hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    //     // verify fundMe
    //     console.log("Wait for 5 confirmations")
    //     await fundMe.deploymentTransaction().wait(5); // 等待部署区块
    //     await verifyFundMe(fundMe.target,[300])
    // } else {
    //     console.log("verifications skipped...")
    // }


    // // init 2 accounts
    const [firstAccount,secondAccount] = await ethers.getSigners()
    // // fund contract with first account
    const fundTx = await fundMe.fund({value:ethers.parseEther("0.005")})
    await fundTx.wait()
    // // check balance of contract
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance of the contract is ${balanceOfContract}`)
    // // fund contract with second account
    const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({value:ethers.parseEther("0.001")})
    await fundTxWithSecondAccount.wait();
    // // check balance of contract 
    const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance of the contract is ${balanceOfContractAfterSecondFund}`)

    // // check mapping fundersToAmount
    const firstAccountBalanceInFundMe= await fundMe.fundersToAmount(firstAccount.address)
    const secondAccountBalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address)
    console.log(`balance of first account ${firstAccount.address} is ${firstAccountBalanceInFundMe}`)
    console.log(`balance of second account ${secondAccount.address} is ${secondAccountBalanceInFundMe}`)

}


async function verifyFundMe(funeMeAddr,args) {
    await hre.run("verify:verify", { 
        address: funeMeAddr,//合约地址
        constructorArguments: args,
    });
}


// 执行main函数，并且捕获异常
main().then().catch((error) => {
    console.log(error);
    process.exit(1)// 以非正常值退出，表示失败
})