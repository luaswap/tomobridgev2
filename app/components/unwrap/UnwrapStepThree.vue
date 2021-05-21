<template>
    <b-container class="step-one text-center">
        <div class="mt-5">
            <h4>You have successfully converted your assets!</h4>
            <div class="text-center mt-3">
                <b-link
                    :href="explorerUrl">View on Etherscan</b-link>
            </div>
        </div>
    </b-container>
</template>

<script>
import urljoin from 'url-join'
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
            explorerUrl: '#',
            config: this.$store.state.config || {}
        }
    },
    async updated () {
    },
    destroyed () {
    },
    created: async function () {
        const parent = this.parent
        const config = this.config
        this.explorerUrl = urljoin(
            config.etherChain.etherScanURL,
            'tx',
            parent.claimTxHash
        )
    },
    methods: {}
}
</script>
