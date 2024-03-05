const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const fs = require("fs")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (developmentChains.includes(network.name)) {
        const EthUsdAggregator = await ethers.getContract("MockV3Aggregator")
        ethUsdPriceFeedAddress = EthUsdAggregator.address
    }
    else {
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed
    }
    console.log("----------------------------------------")

    const lowSVG = await fs.readFileSync("./images/dynamicNft/ethereumRed.svg", { encoding: "utf8" });
    const highSVG = await fs.readFileSync("./images/dynamicNft/ethereumGreen.svg", { encoding: "utf8" });
    const args = [ethUsdPriceFeedAddress, lowSVG, highSVG]
    const dynamicSvgNft = await deploy("DynamicSvgNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,

    })
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(dynamicSvgNft.address, args)
    }
    console.log("----------------------------------------")
}
module.exports.tags = ["all", "dynamicSvgNft", "main"]