<template>
    <b-container class="step-one text-center">
        <div class="mt-5">
            <div
                v-if="isReadyToClaim"
                class="align-items-center steps__row">
                <ul class="ml-5 text-left">
                    <li class="text-danger">
                        Now you need to set Metamask Network to Ethereum
                    </li>
                    <li>
                        Then you need to approve the request on Metamask to complete the transaction
                    </li>
                </ul>
            </div>
            <p>Please keep this window open</p>
            <div class="text-center">
                <b-button
                    :disabled="!isReadyToClaim"
                    class="btn--big st-next m-auto"
                    @click="claimAsset">
                    {{ isReadyToClaim ? `Claim ${fromWrapSelected.symbol}` : 'Transaction Pending' }}
                </b-button>
            </div>
        </div>
        <div
            :class="(loading ? 'tomo-loading' : '')"/>
    </b-container>
</template>

<script>
import axios from 'axios'
import BigNumber from 'bignumber.js'
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
            requiredConfirm: 30,
            confirmation: 0,
            txHash: '',
            isReadyToClaim: false,
            ethIds: [1, 3, 4, 5],
            loading: false,
            txObj: {}
        }
    },
    async updated () {
    },
    destroyed () {
        if (this.interval) {
            clearInterval(this.interval)
        }
    },
    created: async function () {
        const parent = this.parent
        this.config = parent.config
        this.requiredConfirm = parent.fromWrapSelected.confirmations

        this.interval = setInterval(async () => {
            const data = await this.scanTX()
            console.log(data)
            if (data) {
                const outTx = data.transaction.OutTx
                if (outTx.Hash === parent.transactionHash
                    && outTx.Status.toLowerCase() === 'signed_on_hub' && outTx.Signature) {
                    this.isReadyToClaim = true
                    this.txObj = outTx
                    clearInterval(this.interval)
                }
            }
        }, 5000)
    },
    methods: {
        async scanTX () {
            try {
                const parent = this.parent
                const address = this.$store.state.address || ''
                const symbol = parent.fromWrapSelected.symbol
                const txData = await axios.get(
                    `/api/wrap/getTransaction/withdraw/${symbol}/${address}`
                )
                if (txData && txData.data) {
                    return txData.data
                }
            } catch (error) {
                console.log(error)
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        },
        async estimateGas1 () {
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
                        this.recAddress || this.address,
                        this.txObj.Amount,
                        this.txObj.ScID,
                        this.txObj.Hash,
                        0,
                        this.txObj.Signature
                    ).estimateGas({
                        from: this.address
                    })
                } else {
                    estimateGas = await contract.methods.withdrawEth(
                        this.recAddress || this.address,
                        this.txObj.Amount,
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
                    const contract = new this.web3.eth.Contract(
                        this.ContractBridgeEthAbi.abi,
                        config.blockchain.contractBridgeEth
                    )

                    let estimateGas = await this.estimateGas1()
                    const txParams = {
                        from: this.address,
                        gas: estimateGas,
                        gasPrice: this.ethGasPrice,
                        nonce: await this.web3.eth.getTransactionCount(this.address)
                    }

                    if (token.symbol.toLowerCase() !== 'eth') {
                        await contract.methods.withdrawERC20(
                            token.tokenAddress,
                            this.recAddress || this.address,
                            this.txObj.Amount,
                            this.txObj.ScID,
                            this.txObj.Hash,
                            0,
                            this.txObj.Signature
                        ).send(txParams)
                            .on('transactionHash', async txHash => {
                                let check = true
                                while (check) {
                                    const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                                    if (receipt) {
                                        this.loading = false
                                        check = false
                                        parent.step++
                                    }
                                }
                            }).catch(error => {
                                console.log(error)
                                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
                            })
                    } else {
                        await contract.methods.withdrawEth(
                            this.recAddress || this.address,
                            this.txObj.Amount,
                            this.txObj.ScID,
                            this.txObj.Hash,
                            0, // target_chain
                            this.txObj.Signature
                        ).send(txParams)
                            .on('transactionHash', async txHash => {
                                let check = true
                                while (check) {
                                    const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                                    if (receipt) {
                                        this.loading = false
                                        check = false
                                        parent.step++
                                    }
                                }
                            }).catch(error => {
                                console.log(error)
                                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
                            })
                    }
                } else { this.$toasted.show('Need Ethereum network to claim', { type: 'error' }) }
            } catch (error) {
                console.log(error)
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        }
    }
}
</script>
