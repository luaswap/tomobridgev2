<template>
    <b-container class="step-one text-center">
        <div>
            <a
                :href="txUrl"
                target="_blank">Deposit transaction hash</a>
        </div>
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
import urljoin from 'url-join'
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
            config: this.$store.state.config || {},
            interval: '',
            requiredConfirm: 30,
            confirmation: 0,
            txHash: '',
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
        const config = parent.config
        this.txHash = parent.transactionHash
        this.txUrl = urljoin(
            config.etherChain.etherScanURL,
            'tx',
            this.txHash
        )
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
            const parent = this.parent
            const address = parent.address
            const token = parent.fromWrapSelected
            const txData = await axios.get(
                `/api/wrap/getTransaction/deposit/${token.symbol}/${address}`
            )
            if (txData && txData.data) {
                return txData.data
            }
        }
    }
}
</script>
