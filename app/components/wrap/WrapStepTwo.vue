<template>
    <b-container class="step-one text-center">
        <div class="mt-5">
            <p>Please keep this window open</p>
            <div class="text-center">
                <b-button
                    class="btn--big st-next m-auto">
                    {{ confirmation }}/{{ requiredConfirm }} Confirmations
                </b-button>
            </div>
        </div>
    </b-container>
</template>

<script>
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
            depAmount: this.parent.depAmount || 0,
            address: this.parent.address,
            interval: '',
            requiredConfirm: 30,
            confirmation: 0,
            txHash: ''
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
        this.txHash = parent.transactionHash
        this.requiredConfirm = parent.fromWrapSelected.confirmations
        const receipt = await this.web3.eth.getTransactionReceipt(this.txHash)
        const signedBlock = receipt.blockNumber

        this.interval = setInterval(async () => {
            const currentBlock = await this.web3.eth.getBlockNumber()
            this.confirmation = currentBlock - signedBlock
            if (this.confirmation >= this.requiredConfirm) {
                setTimeout(() => {
                    clearInterval(this.interval)
                    parent.step++
                }, 2000)
            }
        }, 5000)
    },
    methods: {
        async scanTX () {
            const address = this.address
            const token = this.fromWrapSelected
            const txData = await axios.get(
                `/api/wrap/getTransaction/deposit/${token.symbol}/${address}`
            )
            if (txData && txData.data) {
                return txData.data
            }
        },
        calculatePercentage (current, total) {
            if (current >= total) {
                return 100
            } else {
                return Math.floor((current * 100) / total)
            }
        }
    }
}
</script>
