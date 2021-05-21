<template>
    <b-container class="step-one text-center">
        <div class="mt-5">
            <h4>You have successfully converted your assets!</h4>
            <div class="text-center mt-3">
                <b-link
                    :href="explorerUrl"
                    target="_blank">
                    View on TomoScan
                </b-link>
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
            parent.outtxObj.Hash || ''
        )
    },
    methods: {}
}
</script>
