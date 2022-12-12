// imports
const { ethers, run, network } = require("hardhat")

// async main
async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory(
        "SimpleStorage"
    )
    console.log("Deploying contract...")
    const simpleStorage = await SimpleStorageFactory.deploy({
        gasPrice: "5000000000",
    })
    await simpleStorage.deployed()

    console.log(`Deployed contract to : ${simpleStorage.address}`)
    // console.log(network.config)

    if(network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY){
      console.log("waiting for block txes...")
      await simpleStorage.deployTransaction.wait(6)
      await verify(simpleStorage.address, [])
    }

    const currentValue = await simpleStorage.retrieve()
    console.log(`Current Value is : ${currentValue}`)

    // Update the current value
    const transactionResponse = await simpleStorage.store(7)
    await transactionResponse.wait(1)
    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated Value is : ${updatedValue}`)
}

async function verify(contractAddress, args) {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("already verified!")
        } else {
            console.log(e)
        }
    }
}

//main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
