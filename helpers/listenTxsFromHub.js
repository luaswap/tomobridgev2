const config = require('config')
const Web3 = require('web3')
const db = require('../models/mongodb')
const axios = require('axios')
const moment = require('moment')
const urljoin = require('url-join')
const BigNumber = require('bignumber.js')
const hubContractAbi = require('../abis/ContractBridgeTomo.json')

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))
const web3 = new Web3(new Web3.providers.WebsocketProvider(config.blockchain.ws))

const HUB_CONTRACT = config.get('blockchain.contractBridgeTomo')

const listenTxsFromHub = async (block = 'latest') => {
    try {
        console.log('Listening to SubmitBurningtx event')
        const { data } = await axios.get(
            urljoin(config.get('serverAPI'), 'tokens?page=1&limit=1000')
        )
        let swapCoin = data.Data.map(d => {
            return {
                symbol: d.symbol,
                decimals: d.decimals,
                wrapperAddress: d.wrap_smart_contract,
                tokenName: d.name,
                mainAddress: d.multisig_wallet,
                tokenAddress: d.address,
                coingecko_id: d.coingecko_id || ''
            }
        })
        // swapCoin = require('./token.json')
        const contract = new web3.eth.Contract(
            hubContractAbi.abi,
            HUB_CONTRACT
        )

        contract.events.SubmitBurningTx({
            fromBlock: block
        })
        .on('connected', (subscriptionId) => {
            console.log('subscriptionId', subscriptionId)
        })
        .on('changed', (data) => console.log('changed', changed))
        .on('data', async event => {
            let result = event
            if (result.event === 'SubmitBurningTx') {
                console.log('Found SubmitBurningTx for burnTx: ', result.returnValues.txHash)
                let blk = await web3.eth.getBlock(result.blockNumber)
                let createdAt = moment.unix(blk.timestamp).utc()
                // get burn tx hash
                const burnTx = result.returnValues.txHash

                // get signer
                const burnTxData = await web3.eth.getTransaction(burnTx)
                const signer = burnTxData.from

                // get recipient, amount, coin
                const burningData = await contract.methods.Transactions(result.returnValues.txHash).call()

                let recipient = burningData.recipient
                let amount
                let tokenAddress = burningData.tokenAddress

                let coin

                if (tokenAddress === '0x0000000000000000000000000000000000000000') {
                    coin = swapCoin.find(s => s.symbol.toLowerCase() === 'eth')
                } else {
                    coin = swapCoin.find(s => s.tokenAddress.toLowerCase() === tokenAddress.toLowerCase())
                }

                if (!coin) {
                    throw new Error(`Cannot find token ${coin} ${tokenAddress}`)
                }

                amount = (new BigNumber(burningData.amount).div(10 ** coin.decimals)).toString(10)

                let data = {
                    signer: signer.toLowerCase(),
                    isClaim: false,
                    coin: coin.symbol.toLowerCase(),
                    burnTx,
                    amount,
                    receivingAddress: recipient.toLowerCase(),
                    status: 'confirmed',
                    createdAt: createdAt,
                    updatedAt: createdAt
                }


                // store db
                const isExist = await db.Transaction.findOne({
                    burnTx: burnTx
                })
                if (!isExist) {
                    console.log(`Store burnTx ${burnTx}`)
                    await db.Transaction.findOneAndUpdate({
                        signer: signer.toLowerCase(),
                        coin: coin.symbol.toLowerCase(),
                        burnTx: burnTx
                    }, { $set: data }, { upsert: true })
                }
            }
        })
        .on('error', (error, receipt) => {
            console.log('error', error)
        })
    } catch (error) {
        console.log('Sonething went wrong', error)
        console.log('Sleep 10 seconds')
        const block = await web3.eth.getBlockNumber()
        await sleep(10000)
        return listenTxsFromHub(block)
        // ha ha ha
    }
}

listenTxsFromHub()
