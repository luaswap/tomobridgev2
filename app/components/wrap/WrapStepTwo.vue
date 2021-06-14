<template>
    <b-container class="step-one text-center">
        <!-- <div>
            <a
                :href="txUrl"
                target="_blank">Deposit transaction hash</a>
        </div> -->
        <div class="mt-2">
            <!-- <p>Please keep this window open</p> -->
            <div class="text-center">
                <b-button
                    class="btn-green w-100">
                    <!-- <div
                        v-if="confirmation < requiredConfirm">
                        {{ confirmation }}/{{ requiredConfirm }} Confirmations
                    </div> -->
                    <div>
                        We are verifying the depositing transaction
                    </div>
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
            interval1: '',
            txHash: '',
            txUrl: '',
            isMint: false,
            outtxObj: {}
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
        const config = parent.config
        this.txHash = parent.transactionHash
        this.txUrl = urljoin(
            config.etherChain.etherScanURL,
            'tx',
            this.txHash
        )
        parent.requiredConfirm = parent.fromWrapSelected.confirmations
        const receipt = await this.web3Eth.eth.getTransactionReceipt(this.txHash)
        const signedBlock = receipt.blockNumber

        this.interval = setInterval(async () => {
            const currentBlock = await this.web3Eth.eth.getBlockNumber()
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
            if (data) {
                const inTx = data.transaction.InTx
                const outTx = data.transaction.OutTx
                if (inTx.Hash === parent.transactionHash &&
                    outTx.Status.toLowerCase() === 'mint') {
                    parent.outTx = outTx
                    this.isMint = true
                    parent.step++
                    clearInterval(this.interval1)
                }
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
