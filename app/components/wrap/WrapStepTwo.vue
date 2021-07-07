<template>
    <div class="step-one text-center">
        <div class="mt-2">
            <div class="text-center">
                <div class="txt-blue2 w-100">
                    We are verifying the depositing transaction
                </div>
            </div>
        </div>
    </div>
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
            outtxObj: {},
            contract: {}
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
            if (data && data.transaction) {
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
            const txData = await axios.get(
                `/api/wrap/getTransaction/${parent.transactionHash}`
            )
            if (txData && txData.data) {
                return txData.data
            }
        }
    }
}
</script>
