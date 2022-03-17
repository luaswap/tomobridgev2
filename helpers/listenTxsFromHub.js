const config = require('config')
const Web3 = require('web3')
const db = require('../models/mongodb')
const axios = require('axios')
const moment = require('moment')
const urljoin = require('url-join')
const BigNumber = require('bignumber.js')
const hubContractAbi = require('../abis/ContractBridgeTomo.json')

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))
// https://rpc.tomochain.com  wss://ws.tomochain.com
// https://rpc.testnet.tomochain.com  wss://ws.testnet.tomochain.com

const rpc = 'https://rpc.tomochain.com' // config.blockchain.rpc
const ws = 'wss://ws.tomochain.com' // config.blockchain.ws
let web3, web3Rpc

const HUB_CONTRACT = config.get('blockchain.contractBridgeTomo') // 0xd814E8bB79082A2bf7D59A634b5134670f632837
let currentBlock = 0
let blockNumber
const bridgeAbi = config.get('serverAPI')

const listenTxsFromHub = async (block = 'latest') => {
    try {
        console.log(rpc)
        web3 = new Web3(new Web3.providers.WebsocketProvider(ws))
        web3Rpc = new Web3(new Web3.providers.HttpProvider(rpc))
        blockNumber = await web3Rpc.eth.getBlockNumber()

        console.log(`Listening to SubmitBurningtx event from ${block} to ${blockNumber}`, )
        const { data } = await axios.get(
            urljoin(bridgeAbi, 'tokens?page=1&limit=1000')
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
            '0xd814E8bB79082A2bf7D59A634b5134670f632837'
        )

        contract.getPastEvents('SubmitBurningTx', {
            fromBlock: block,
            toBlock: blockNumber
        }).then(async (events) => {
            console.log(1111)
            console.log(events)
            let map = events.map(async event => {
                let result = event
                if (result.event === 'SubmitBurningTx') {
                    console.log('Found SubmitBurningTx for burnTx: ', result.returnValues.txHash)
                    let blk = await web3Rpc.eth.getBlock(result.blockNumber)
                    let createdAt = moment.unix(blk.timestamp).utc()
                    // get burn tx hash
                    const burnTx = result.returnValues.txHash

                    // get signer
                    const burnTxData = await web3Rpc.eth.getTransaction(burnTx)
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

                    if (coin) {
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
                }
            })
            currentBlock = blockNumber
            await Promise.all(map)
            console.log('Sleep 30 seconds')
            await sleep(30000)

            return listenTxsFromHub(currentBlock)
        }).catch(async error => {
            console.log(error)
            web3 = new Web3(new Web3.providers.WebsocketProvider(ws))
            web3Rpc = new Web3(new Web3.providers.HttpProvider(rpc))
            console.log('Sleep 10 seconds')
            await sleep(10000)
            console.log('Listen event again from block', block)
            return listenTxsFromHub(block)
        })
    } catch (error) {
        console.log('Sonething went wrong', new Error(error))
        web3 = new Web3(new Web3.providers.WebsocketProvider(ws))
        web3Rpc = new Web3(new Web3.providers.HttpProvider(rpc))
        console.log('Sleep 10 seconds')
        await sleep(10000)
        currentBlock = block
        return listenTxsFromHub(currentBlock)
        // ha ha ha
    }
}

listenTxsFromHub()
