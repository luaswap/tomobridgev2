<template>
    <div class="step-one text-center">
        <div class="mt-3">
            <div class="text-center mt-3">
                <b-button
                    :href="explorerUrl"
                    target="_blank"
                    class="btn-green w-100">
                    Check transaction on TomoScan
                </b-button>
            </div>
        </div>
    </div>
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
            'tx',
            parent.outTx.Hash || ''
        )
    },
    methods: {}
}
</script>
