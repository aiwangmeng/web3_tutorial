//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";


// 1. 创建一个收款函数
// 2. 记录一个收款人并查询
// 3. 在锁定期内，达到目标值，生产者可以提款
// 4. 在锁定期内，未达到目标值，投资人在锁定期后退款


contract FundMe {

    uint256 constant MINIMUN_VALUE = 1 * 10 ** 18; //USD

    uint256 constant TARGET = 100 * 10 ** 18; //USD

    address public owner;

    address erc20Addr;

    mapping(address => uint256) public fundersToAmount;

    uint256 deploymentTimestamp;
    uint256 lockTime;

    bool public getFundSuccess = false;

    AggregatorV3Interface internal dataFeed;
    constructor(uint256 _lockTime) {
        // sepolia testnet
        dataFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        owner = msg.sender;
        deploymentTimestamp = block.timestamp;
        lockTime = _lockTime;
    }

    function fund() external payable {
        require( convertEthToUsd(msg.value) >= MINIMUN_VALUE,"Send more ETH");
        require(block.timestamp < (deploymentTimestamp + lockTime),"window is close");
        fundersToAmount[msg.sender] = msg.value;
    }


    function getChainlinkDataFeedLatestAnswer() public  view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }

    function convertEthToUsd(uint256 ethAmount) internal view  returns(uint256){
        uint256 ethPrice = uint256(getChainlinkDataFeedLatestAnswer());
        return  ethAmount * (ethPrice / 10  ** 8);
    }

    function transferOwnership(address newOwer) public onlyOwner {
        owner = newOwer;
    }


    function getFund() external windowClosed onlyOwner {
        require(convertEthToUsd(address(this).balance) >= TARGET , "Target is not reached");
        
       
        // transfer: transfer ETH and revert if tx failed
        // payable(msg.sender).transfer(address(this).balance); 
        // send: transfer ETH and return false if failed
        // bool success = payable(msg.sender).send(address(this).balance);
        // require(success , "tx failed");

        // call: transfer ETH with data return value of function and bool
        bool success;
        (success, ) = payable(msg.sender).call{value:address(this).balance}("");
        require(success,"transfer tx failed");
        fundersToAmount[msg.sender] = 0;
        getFundSuccess = true;
    }


    // 这里限制只有FundTokenERC20通证才能调该方法
    function setFundToAmount(address funder , uint256 amountToUpdate) external {
        require(msg.sender == erc20Addr ,"you do not have permissin to call this function");
        fundersToAmount[funder] = amountToUpdate;
    }

    function setErc20Addr (address _erc20Addr) public onlyOwner{
        erc20Addr = _erc20Addr;
    }
 
    // 退款
    function reFund() external windowClosed {
        require(convertEthToUsd(address(this).balance) < TARGET,"targe is reached");
        require(fundersToAmount[msg.sender] != 0 ,"you have not funded");
        bool success;
        (success, ) = payable(msg.sender).call{value:fundersToAmount[msg.sender]}("");
        require(success,"transfer tx failed");
        fundersToAmount[msg.sender] = 0;
    }

    modifier windowClosed() {
        require(block.timestamp >= (deploymentTimestamp + lockTime),"window is not close");
        _;
    }

    modifier onlyOwner(){
        require(msg.sender == owner , "this function can only be called by owner");
        _;
    }

}