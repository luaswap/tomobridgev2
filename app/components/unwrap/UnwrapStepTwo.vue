<template>
    <b-container class="step-one text-center">
        <div>
            <a
                :href="txUrl"
                target="_blank">Burning transaction hash</a>
        </div>
        <div class="">
            <div
                v-if="isReadyToClaim"
                class="steps__row justify-content-center">
                <ul class="my-4 ml-5 text-left st-ul d-inline-block">
                    <li class="">
                        <div class="text-danger li-span">Set your Metamask network to Ethereum to continue</div>
                    </li>
                    <li class="">
                        <div class="text-danger li-span">Make sure you have enough ETH on your Ethereum network</div>
                    </li>
                    <li class="">
                        <div class="text-danger li-span">Click on "Claim {{ fromWrapSelected.symbol }}"</div>
                    </li>
                    <li class="">
                        <div class="text-danger li-span">Approve the request on Metamask to complete the transaction</div>
                    </li>
                </ul>
            </div>
            <p>Please keep this window open</p>
            <div class="text-center">
                <b-button
                    v-if="!isReadyToClaim"
                    class="btn--big st-next m-auto">
                    <div
                        v-if="confirmation < requiredConfirm">
                        {{ confirmation }}/{{ requiredConfirm }} Confirmations
                    </div>
                    <div
                        v-else>
                        We are verifying the burning transaction
                    </div>
                </b-button>
                <b-button
                    v-else
                    class="btn--big st-next m-auto"
                    @click="claimAsset">
                    Claim {{ fromWrapSelected.symbol }}
                </b-button>
            </div>
        </div>
        <div
            :class="(loading ? 'tomo-loading' : '')"/>
    </b-container>
</template>

<script>
import axios from 'axios'
import urljoin from 'url-join'
// import BigNumber from 'bignumber.js'
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
            isReadyToClaim: true,
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
    },
    created: async function () {
        const parent = this.parent
        const config = this.config
        console.log(config)
        const receipt = await this.web3.eth.getTransactionReceipt(parent.transactionHash)
        this.txUrl = urljoin(
            config.tomoscanUrl,
            'txs',
            parent.transactionHash
        )
        const signedBlock = receipt.blockNumber
        this.interval = setInterval(async () => {
            const currentBlock = await this.web3.eth.getBlockNumber()
            this.confirmation = currentBlock - signedBlock
            if (this.confirmation >= this.requiredConfirm) {
                this.confirmation = this.requiredConfirm
                setTimeout(() => {
                    clearInterval(this.interval)
                }, 2000)
            }
        }, 5000)

        this.interval1 = setInterval(async () => {
            const data = await this.scanTX()
            if (data) {
                const outTx = data.transaction.OutTx
                if (outTx.Hash === parent.transactionHash &&
                    outTx.Status.toLowerCase() === 'signed_on_hub' && outTx.Signature) {
                    this.isReadyToClaim = true
                    this.txObj = outTx
                    clearInterval(this.interval1)
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
                                parent.claimTxHash = txHash
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
                                this.loading = false
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
                                parent.claimTxHash = txHash
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
                                this.loading = false
                                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
                            })
                    }
                } else { this.$toasted.show('Need Ethereum network to claim', { type: 'error' }) }
            } catch (error) {
                console.log(error)
                this.loading = false
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        }
    }
}
</script>
