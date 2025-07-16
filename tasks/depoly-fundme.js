const { task }= require("hardhat/config")

task("depoly-fundme","depoly and verify contract").setAction(async(taskArgs,hre) => {
        // create factory
        const fundMeFactory = await ethers.getContractFactory("FundMe")
        console.log("contract is deploying")
        // depoly contracts from factory
        const fundMe =  await fundMeFactory.deploy(300)
        await fundMe.waitForDeployment()
        // console.log("contract has been depolyed successfully , contract address is " + fundMe.target);
        console.log(`contract has been depolyed successfully , contract address is  ${fundMe.target}`);
    
        // if(hre.network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
        //     // verify fundMe
        //     console.log("Wait for 5 confirmations")
        //     await fundMe.deploymentTransaction().wait(5); // 等待部署区块
        //     await verifyFundMe(fundMe.target,[10])
        // } else {
        //     console.log("verifications skipped...")
        // }
})