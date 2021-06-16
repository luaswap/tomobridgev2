<template>
    <b-container class="step-one text-center">
        <div class="mt-2">
            <div class="text-center">
                <b-button
                    v-if="isSigned"
                    class="btn-green w-100">
                    Transaction pending
                </b-button>
                <div
                    v-else
                    class="d-flex">
                    <b-button
                        class="w-100 st-back m-auto"
                        @click="back">
                        Back
                    </b-button>
                    <b-button
                        class="btn-green w-100 m-auto"
                        @click="deposit">
                        Approve request
                    </b-button>
                </div>
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
            ethIds: [1, 3, 4, 5],
            isSigned: false
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
        back () {
            this.$router.go(-1)
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
        },
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
                                this.loading = false
                                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
                            })
                    } else {
                        txParams.value = this.web3.utils.toWei(this.depAmount.toString(), 'ether')
                        await this.contract.methods.swapEth(
                            this.recAddress || this.address
                        ).send(txParams)
                            .on('transactionHash', async txHash => {
                                this.isSigned = true
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
                                this.loading = false
                                this.isSigned = false
                                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
                            })
                    }
                } else { this.$toasted.show('Set your Metamask network to Ethereum', { type: 'error' }) }
            } catch (error) {
                console.log(error)
                this.loading = false
                this.isSigned = false
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        }
    }
}
</script>
