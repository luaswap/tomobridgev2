<template>
    <div class="step-one text-center">
        <div class="text-center">
            <div
                v-if="!isReadyToClaim"
                class="txt-blue2 w-100">
                We are verifying the burning transaction
            </div>
            <div
                v-else
                class="d-flex">
                <b-button
                    class="st-back w-100 mr-2"
                    @click="back">
                    Back
                </b-button>
                <b-button
                    class="btn-green w-100 ml-2"
                    @click="claimAsset">
                    Claim {{ fromWrapSelected.symbol }}
                </b-button>
            </div>
        </div>
        <div
            :class="(loading ? 'tomo-loading' : '')"/>
    </div>
</template>

<script>
import axios from 'axios'
import urljoin from 'url-join'
import BigNumber from 'bignumber.js'
import store from 'store'
export default {
    name: 'App',
    components: {
    },
    props: {
        parent: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            recAddress: this.parent.recAddress || '',
            fromWrapSelected: this.parent.fromWrapSelected || '',
            config: this.$store.state.config || {},
            amount: this.parent.amount || 0,
            address: this.parent.address,
            interval: '',
            txHash: '',
            isReadyToClaim: false,
            ethIds: [1, 3, 4, 5],
            loading: false,
            txObj: {},
            interval1: '',
            txUrl: ''
        }
    },
    async updated () {
    },
    destroyed () {
        if (this.interval) {
            clearInterval(this.interval)
        }
        if (this.interval1) {
            clearInterval(this.interval1)
        }
    },
    created: async function () {
        const parent = this.parent
        const config = this.config
        const receipt = await this.web3Tomo.eth.getTransactionReceipt(parent.transactionHash)
        this.txUrl = urljoin(
            config.tomoscanUrl,
            'txs',
            parent.transactionHash
        )
        const signedBlock = receipt.blockNumber
        this.interval = setInterval(async () => {
            const currentBlock = await this.web3Tomo.eth.getBlockNumber()
            parent.confirmation = currentBlock - signedBlock
            if (parent.confirmation >= parent.requiredConfirm) {
                parent.confirmation = parent.requiredConfirm
                setTimeout(() => {
                    clearInterval(this.interval)
                }, 2000)
            }
        }, 5000)

        this.interval1 = setInterval(async () => {
            const data = await this.scanTX()
            if (data && data.transaction) {
                const outTx = data.transaction.OutTx
                const inTx = data.transaction.InTx
                if (outTx.Hash === parent.transactionHash &&
                    outTx.Status.toLowerCase() === 'signed_on_hub' && outTx.Signature) {
                    this.isReadyToClaim = true
                    this.txObj = outTx
                    this.inTxObj = inTx
                    clearInterval(this.interval1)
                }
            }
        }, 5000)
    },
    methods: {
        back () {
            this.$router.push({ path: '/select' })
        },
        async scanTX () {
            try {
                const parent = this.parent
                const txData = await axios.get(
                    `/api/wrap/getTransaction/${parent.transactionHash}`
                )
                if (txData && txData.data) {
                    return txData.data
                }
            } catch (error) {
                console.log(error)
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        },
        async estimateGas () {
            try {
                const config = this.config
                const token = this.fromWrapSelected
                let estimateGas
                const contract = new this.web3.eth.Contract(
                    this.ContractBridgeEthAbi.abi,
                    config.blockchain.contractBridgeEth
                )
                if (token.symbol.toLowerCase() !== 'eth') {
                    estimateGas = await contract.methods.withdrawERC20(
                        token.tokenAddress,
                        this.recAddress,
                        this.inTxObj.Amount,
                        this.txObj.ScID,
                        this.txObj.Hash,
                        0,
                        this.txObj.Signature
                    ).estimateGas({
                        from: this.address
                    })
                } else {
                    estimateGas = await contract.methods.withdrawEth(
                        this.recAddress,
                        this.inTxObj.Amount,
                        this.txObj.ScID,
                        this.txObj.Hash,
                        0, // target_chain
                        this.txObj.Signature
                    ).estimateGas({
                        from: this.address
                    })
                }
                return estimateGas
            } catch (error) {
                console.log(error)
            }
        },
        async claimAsset () {
            try {
                const config = this.config
                const parent = this.parent
                const token = this.fromWrapSelected
                const chainId = await this.getChainId()
                if (this.ethIds.indexOf(chainId) > -1) {
                    this.loading = true
                    const contract = new this.web3.eth.Contract(
                        this.ContractBridgeEthAbi.abi,
                        config.blockchain.contractBridgeEth
                    )
                    const hubContract = new this.web3Tomo.eth.Contract(
                        this.ContractBridgeTomoAbi.abi,
                        config.blockchain.contractBridgeTomo
                    )
                    const txData = await hubContract.methods.Transactions(parent.transactionHash).call()

                    let estimateGas = await this.estimateGas()
                    if (!estimateGas) { estimateGas = 150000 }

                    const txParams = {
                        from: this.address,
                        gas: new BigNumber(estimateGas).isGreaterThan(150000) ? 150000 : estimateGas,
                        gasPrice: this.ethGasPrice,
                        nonce: await this.web3.eth.getTransactionCount(this.address)
                    }

                    if (token.symbol.toLowerCase() !== 'eth') {
                        await contract.methods.withdrawERC20(
                            token.tokenAddress,
                            this.recAddress || this.txObj.To,
                            txData.amount,
                            this.txObj.ScID,
                            this.txObj.Hash,
                            0,
                            this.txObj.Signature
                        ).send(txParams)
                            .on('transactionHash', async txHash => {
                                let check = true
                                parent.claimTxHash = txHash
                                while (check) {
                                    const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                                    if (receipt && receipt.status) {
                                        await this.updateTransaction()
                                        store.remove('pendingWithdraw')
                                        this.loading = false
                                        check = false
                                        parent.step++
                                    }
                                }
                            }).catch(error => {
                                console.log(error)
                                this.loading = false
                                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
                            })
                    } else {
                        await contract.methods.withdrawEth(
                            this.recAddress || this.txObj.To,
                            txData.amount,
                            this.txObj.ScID,
                            this.txObj.Hash,
                            0, // target_chain
                            this.txObj.Signature
                        ).send(txParams)
                            .on('transactionHash', async txHash => {
                                let check = true
                                parent.claimTxHash = txHash
                                while (check) {
                                    const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                                    if (receipt && receipt.status) {
                                        await this.updateTransaction()
                                        this.loading = false
                                        check = false
                                        parent.step++
                                    }
                                }
                            }).catch(error => {
                                console.log(error)
                                this.loading = false
                                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
                            })
                    }
                } else { this.$toasted.show('Need Ethereum network to claim asset', { type: 'error' }) }
            } catch (error) {
                console.log(error)
                this.loading = false
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        },
        async updateTransaction () {
            const parent = this.parent
            const token = this.fromWrapSelected
            try {
                axios.post('/api/account/updateTx', {
                    address: this.address,
                    burnTx: parent.transactionHash,
                    coin: token.symbol.toLowerCase(),
                    claimTx: parent.claimTxHash,
                    isClaim: true,
                    amount: this.amount,
                    receivingAddress: this.recAddress,
                    status: 'confirmed'
                })
            } catch (error) {
                console.log(error)
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        }
    }
}
</script>
