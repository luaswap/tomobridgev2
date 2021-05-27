<template>
    <b-modal
        id="claimModal"
        ref="claimModal"
        centered
        scrollable
        size="sm"
        no-close-on-backdrop
        hide-header
        hide-footer>
        <b-container>
            <div class="mt-2 text-center">Claim token</div>
            <div class="mt-4">
                Burning TX:
                <a
                    :href="burnTxUrl"
                    target="_blank">
                    {{ truncate(unClaimTx.burnTx || '', 20) }}
                </a>
            </div>
        </b-container>
    </b-modal>
</template>

<script>
import urljoin from 'url-join'
export default {
    name: 'App',
    components: { },
    mixins: [],
    props: {
        parent: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            config: this.$store.state.config,
            burnTxUrl: '#'
        }
    },
    computed: {
        unClaimTx: {
            get () {
                return this.$store.getters.unClaimTx || {}
            },
            set () {}
        },
        address: {
            get () {
                return this.$store.getters.address
            },
            set () {}
        }
    },
    validations: { },
    async updated () {
    },
    destroyed () { },
    created: async function () {
        const config = this.config
        this.burnTxUrl = urljoin(
            config.tomoscanUrl,
            'txs',
            this.unClaimTx.burnTx
        )
    },
    methods: {
        show () {
            this.$refs.claimModal.show()
        }
    }
}
</script>
