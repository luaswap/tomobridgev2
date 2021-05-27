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

                <b-button
                    @click="claim">Claim</b-button>
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
        config: {
            get () {
                return this.$store.getters.config
            },
            set () {}
        }
    },
    validations: { },
    async updated () {
    },
    destroyed () { },
    created: async function () {
        if (this.unClaimTx && this.unClaimTx.burnTx) {
            this.burnTxUrl = urljoin(
                this.config.tomoscanUrl,
                'txs',
                this.unClaimTx.burnTx
            )
        }
    },
    methods: {
        show () {
            this.$refs.claimModal.show()
        },
        hide () {
            this.$refs.claimModal.hide()
        },
        async claim () {
            const coinObj = this.config.objSwapCoin
            this.hide()
            this.$router.push({
                name: 'UnwrapExecution',
                params: {
                    recAddress: '',
                    amount: 0,
                    fromWrapSelected: coinObj[this.unClaimTx.coin],
                    isClaimable: true
                }
            })
        }
    }
}
</script>
