const config = require('config')
const Web3 = require('web3')
const db = require('../models/mongodb')

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))
const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchain.rpc))

const scanNotConfirmTx = async () => {
    try {
        console.log(`Checking not confirm tx at ${new Date()}`)
        const data = await db.Transaction.find({ status: 'notConfirm' })
        if (data.length === 0) {
            console.log('Found nothing!')
        } else {
            data.map(async d => {
                const receipt = await web3.eth.getTransactionReceipt(d.burnTx)
                if (receipt && receipt.status) {
                    await db.Transaction.updateOne({
                        signer: d.signer.toLowerCase(),
                        burnTx: d.burnTx
                    }, { $set: { status: 'confirmed' } })
                    console.log(`Done update burn tx: ${d.burnTx}`)
                }
            })
        }
    } catch (error) {
        console.log('Sonething went wrong', error)
        await sleep(30000)
        return scanNotConfirmTx()
    }
    await sleep(30000)
    return scanNotConfirmTx()
}

scanNotConfirmTx()
