const { task }= require("hardhat/config")

task("interact-contract","interact with fundme contract")
.addParam("addr","fundme contract address")
.setAction(async(taskArgs,hre) => {
        //因为这里没有初始化合约所以需要拿到合约地址
        const fundMeFactory = await ethers.getContractFactory("fundMe")
        const fundMe = fundMeFactory.attach(taskArgs.addr)
        // init 2 accounts
        const [firstAccount,secondAccount] = await ethers.getSigners()
        // fund contract with first account
        const fundTx = await fundMe.fund({value:ethers.parseEther("0.005")})
        await fundTx.wait()
        // check balance of contract
        const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
        console.log(`Balance of the contract is ${balanceOfContract}`)
        // fund contract with second account
        const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({value:ethers.parseEther("0.001")})
        await fundTxWithSecondAccount.wait();
        // check balance of contract 
        const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target)
        console.log(`Balance of the contract is ${balanceOfContractAfterSecondFund}`)
    
        // check mapping fundersToAmount
        const firstAccountBalanceInFundMe= await fundMe.fundersToAmount(firstAccount.address)
        const secondAccountBalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address)
        console.log(`balance of first account ${firstAccount.address} is ${firstAccountBalanceInFundMe}`)
        console.log(`balance of second account ${secondAccount.address} is ${secondAccountBalanceInFundMe}`)

})