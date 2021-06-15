<template>
    <b-container class="step-one text-center">
        <div class="mt-3">
            <!-- <h4>You have successfully converted your assets!</h4> -->
            <div class="text-center mt-3">
                <!-- <b-link
                    :href="explorerUrl"
                    target="_blank">
                    Check transaction on TomoScan
                </b-link> -->
                <b-button
                    :href="explorerUrl"
                    target="_blank"
                    class="btn-green w-100">
                    Check transaction on TomoScan
                </b-button>
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
        this.explorerUrl = urljoin(
            this.config.tomoscanUrl,
            'txs',
            parent.outTx.Hash || ''
        )
    },
    methods: {}
}
</script>
