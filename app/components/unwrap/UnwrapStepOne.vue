<template>
    <b-container class="step-one text-center">
        <!-- <p class="text-danger font-weight-bold">You need to sign the request on MetaMask to activate the withdrawal request</p> -->
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
                        class="w-100 m-auto"
                        @click="withdraw">
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
import axios from 'axios'
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
            gasPrice: '',
            loading: false,
            feeAmount: 0,
            tomoFeeMode : false,
            contract: {},
            fee: 0,
            tomoIds: [88, 89, 99],
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
            this.contract = new this.web3.eth.Contract(
                this.TomoBridgeTokenAbi.abi,
                this.fromWrapSelected.wrapperAddress.toLowerCase()
            )
            this.tomoFeeMode = await this.contract.methods.TOMO_FEE_MODE.call()
            await this.getWithdrawFee()

            this.web3.eth.getGasPrice()
                .then(data => {
                    this.gasPrice = data
                    this.withdraw()
                })
                .catch(error => console.log(error))
        }
    },
    methods: {
        back () {
            this.$router.go(-1)
        },
        convertWithdrawAmount (amount) {
            let decimals = parseInt(this.fromWrapSelected.decimals)
            return (new BigNumber(amount).multipliedBy(10 ** decimals)).toString(10)
        },
        async getWithdrawFee () {
            const coin = this.fromWrapSelected
            let feeBN
            if (this.tomoFeeMode) {
                feeBN = await this.contract.methods.WITHDRAW_FEE_TOMO().call()
                this.fee = new BigNumber(feeBN).div(10 ** 18).toString(10)
                this.feeAmount = new BigNumber(feeBN).toString(10)
            } else {
                feeBN = await this.contract.methods.WITHDRAW_FEE().call()
                this.fee = new BigNumber(feeBN).div(10 ** coin.decimals).toString(10)
            }
        },
        async withdraw () {
            try {
                if (this.tomoIds.indexOf(this.network.chainId) > -1) {
                    this.loading = true
                    const config = this.config
                    const chainConfig = config.blockchain
                    const parent = this.parent
                    let txParams = {
                        value: this.tomoFeeMode ? this.web3.utils.toHex(this.feeAmount) : this.web3.utils.toHex(0),
                        from: this.address,
                        gasPrice: this.web3.utils.toHex(this.gasPrice),
                        gas: this.web3.utils.toHex(chainConfig.gas)
                    }

                    await this.contract.methods.burn(
                        this.convertWithdrawAmount(this.amount),
                        this.string2byte(this.recAddress)
                    ).send(txParams)
                        .on('transactionHash', async (txHash) => {
                            this.isSigned = true
                            parent.transactionHash = txHash
                            let check = true
                            while (check) {
                                const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                                if (receipt && receipt.status) {
                                    axios.post('/api/account/updateTx', {
                                        address: this.address,
                                        burnTx: txHash,
                                        coin: this.fromWrapSelected.symbol.toLowerCase(),
                                        isClaim: false,
                                        burningTime: new Date(),
                                        amount: this.amount,
                                        receivingAddress: this.recAddress
                                    })
                                    check = false
                                    this.loading = false
                                    parent.step++
                                }
                            }
                        }).catch(error => {
                            console.log(error)
                            this.loading = false
                            this.isSigned = false
                            this.$toasted.show(error.message ? error.message : error, { type: 'error' })
                        })
                } else { this.$toasted.show('Set your Metamask network to TomoChain', { type: 'error' }) }
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
