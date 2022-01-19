<template>
    <b-modal
        id="claimedModal"
        ref="claimedModal"
        centered
        size="md"
        scrollable
        no-close-on-backdrop
        hide-header
        hide-footer>
        <b-container>
            <h6>
                We found that this transaction has claimed
            </h6>
            <h6>
                Click 'OK' to redirect to selection page
            </h6>

            <div
                class="mt-3">
                <b-button
                    class="btn-green w-100"
                    @click="updateTx">OK</b-button>
            </div>
        </b-container>
        <div
            :class="(loading ? 'tomo-loading' : '')"/>
    </b-modal>
</template>

<script>
import axios from 'axios'
import store from 'store'
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
            loading: false
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
        },
        address: {
            get () {
                return this.$store.getters.address
            },
            set () {}
        }
    },
    watch: {
    },
    validations: { },
    async updated () {
    },
    destroyed () { },
    created: async function () {
    },
    methods: {
        show () {
            this.$refs.claimedModal.show()
        },
        hide () {
            this.$refs.claimedModal.hide()
        },
        async updateTx () {
            const parent = this.parent
            this.loading = true
            try {
                await axios.post('/api/account/updateTx', {
                    address: this.address,
                    burnTx: this.unClaimTx.burnTx,
                    coin: this.unClaimTx.coin.toLowerCase(),
                    isClaim: true,
                    amount: this.unClaimTx.amount,
                    receivingAddress: this.unClaimTx.receivingAddress
                })
                if (store.get('pendingWithdraw')) {
                    store.remove('pendingWithdraw')
                }
                this.loading = false
                this.hide()
                parent.checkUnclaimTx()
            } catch (error) {
                console.log(error)
                this.loading = false
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        }
    }
}
</script>
