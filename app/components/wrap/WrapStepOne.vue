<template>
    <b-container class="step-one text-center">
        <p class="text-danger">You need to sign the request on MetaMask to activate the withdrawal request</p>
        <!-- <p>Your withdrawal request has been successfully approved</p> -->
        <div class="mt-5">
            <p>Please keep this window open</p>
            <div class="text-center">
                <b-button
                    class="btn--big st-next m-auto">
                    Transaction pending
                </b-button>
            </div>
        </div>
        <div
            :class="(loading ? 'tomo-loading' : '')"/>
    </b-container>
</template>

<script>
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
            depAmount: this.parent.depAmount || 0,
            address: this.parent.address,
            ethGasPrice: '',
            loading: false,
            ethIds: [1, 3, 4, 5]
        }
    },
    computed: {
        network: {
            get () {
                return this.$store.getters.network
            },
            set () {}
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
        if (!this.$store.state.address) {
            this.$router.push({
                path: '/select'
            })
        } else {
            const config = this.config
            this.contract = new this.web3.eth.Contract(
                this.ContractBridgeEthAbi.abi,
                config.blockchain.contractBridgeEth
            )
            this.web3.eth.getGasPrice()
                .then(data => {
                    this.ethGasPrice = data
                    this.deposit()
                })
                .catch(error => console.log(error))
        }
    },
    methods: {
        async deposit () {
            try {
                if (this.ethIds.indexOf(this.network.chainId) > -1) {
                    this.loading = true
                    const parent = this.parent
                    const token = this.fromWrapSelected

                    let estimateGas = await this.estimateGas1()
                    const txParams = {
                        from: this.address,
                        gas: estimateGas,
                        gasPrice: this.ethGasPrice,
                        nonce: await this.web3.eth.getTransactionCount(this.address)
                    }
                    if (token.symbol.toLowerCase() !== 'eth') {
                        await this.contract.methods.swapErc20(
                            token.tokenAddress,
                            this.recAddress || this.address,
                            new BigNumber(this.depAmount).multipliedBy(10 ** token.decimals).toString(10)
                        ).send(txParams)
                            .on('transactionHash', async txHash => {
                                parent.transactionHash = txHash
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
                        txParams.value = this.web3.utils.toWei(this.depAmount.toString(), 'ether')
                        await this.contract.methods.swapEth(
                            this.recAddress || this.address
                        ).send(txParams)
                            .on('transactionHash', async txHash => {
                                parent.transactionHash = txHash
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
                } else { this.$toasted.show('Need Ethereum network to wrap', { type: 'error' }) }
            } catch (error) {
                console.log(error)
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        },
        async estimateGas1 () {
            try {
                const token = this.fromWrapSelected
                let estimateGas
                if (token.symbol.toLowerCase() !== 'eth') {
                    estimateGas = await this.contract.methods.swapErc20(
                        token.tokenAddress,
                        this.recAddress || this.address,
                        new BigNumber(this.depAmount).multipliedBy(10 ** token.decimals).toString(10)
                    ).estimateGas({
                        from: this.address
                    })
                } else {
                    estimateGas = await this.contract.methods.swapEth(
                        this.recAddress || this.address
                    ).estimateGas({
                        from: this.address,
                        value: this.web3.utils.toWei(this.depAmount.toString(), 'ether')
                    })
                }
                return estimateGas
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>
