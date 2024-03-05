const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const {
    developmentChains
} = require("../../helper-hardhat-config")
const { solidity } = require("ethereum-waffle")
const { assert } = require("chai")
const chai = require("chai")
chai.use(solidity)
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle", async () => {
        let basicNft,
            deployer
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer
            await deployments.fixture(["BasicNft"])
            basicNft = await ethers.getContract("BasicNft", deployer)
        })
        describe("constructor", () => {
            it("initializes the Basic Nft correctly", async () => {
                const name = await basicNft.name()
                assert.equal(name, "Dogie")
                const symbol = await basicNft.symbol()
                assert.equal(symbol, "DOG")
            })
        })
        describe("getTokenCounter", () => {
            it("initializes the tokenCounter to zero", async () => {
                const tokenCounter = await basicNft.getTokenCounter()
                assert.equal(tokenCounter, 0)
            })
        })
        describe("mintNft", () => {
            it("increments by one tokenCounter when a nft is minted", async () => {
                const InitialTokenCounter = await basicNft.getTokenCounter()
                const txResponse = await basicNft.mintNft()
                await txResponse.wait(1)
                const FinalTokenCounter = await basicNft.getTokenCounter()
                assert.equal(FinalTokenCounter - InitialTokenCounter, 1)
            })
            it("Show the correct balance and owner of an NFT", async function () {
                const txResponse = await basicNft.mintNft()
                await txResponse.wait(1)
                const deployerAddress = deployer.address;
                const deployerBalance = await basicNft.balanceOf(deployerAddress)
                const owner = await basicNft.ownerOf("0")
                assert.equal(deployerBalance.toString(), "1")
                assert.equal(owner, deployerAddress)
            })
        })
        describe("tokenURI", () => {
            it("displays token URI", async () => {
                const tokenURI = await basicNft.tokenURI(0)
                assert.equal(tokenURI, "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json")
            })
        })

    })
