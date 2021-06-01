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
            <div class="mt-2 text-center">You have a pending transaction!</div>
            <div class="claim-modal text-center">
                <b-row
                    class="mt-4 align-items-center modal-row">
                    <b-col
                        class="text-left"
                        cols="4">
                        <div class="font-weight-bold">Approved burn TxHash</div>
                    </b-col>
                    <b-col
                        cols="8">
                        <a
                            :href="burnTxUrl"
                            target="_blank">
                            {{ truncate(unClaimTx.burnTx || '', 20) }}
                        </a>
                    </b-col>
                </b-row>
                <b-row
                    class="mt-4 d-flex align-items-center modal-row">
                    <b-col
                        class="text-left"
                        cols="4">
                        <div class="font-weight-bold">Timestamp</div>
                    </b-col>
                    <b-col
                        cols="8">
                        {{ dateTime }}
                    </b-col>
                </b-row>
                <b-row
                    class="mt-4 d-flex align-items-center ">
                    <b-col
                        class="modal-row"
                        cols="4">
                        <div
                            class="font-weight-bold">{{ (unClaimTx.coin || '').toUpperCase() }}</div>
                    </b-col>
                    <b-col
                        class="modal-row"
                        cols="8">
                        {{ unClaimTx.amount }}
                    </b-col>
                </b-row>
            </div>
            <div
                class="text-center mt-4">
                <b-button
                    class="btn--big light-h"
                    @click="claim">Claim</b-button>
            </div>
        </b-container>
    </b-modal>
</template>

<script>
import urljoin from 'url-join'
import moment from 'moment'
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
            burnTxUrl: '#',
            dateTime: ''
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
            this.dateTime = moment(this.unClaimTx.burningTime).format('DD/MM/YYYY')
        }
        this.$bus.$on('reclaim', () => {
            if (this.unClaimTx && this.unClaimTx.burnTx) {
                this.burnTxUrl = urljoin(
                    this.config.tomoscanUrl,
                    'txs',
                    this.unClaimTx.burnTx
                )
                this.dateTime = moment(this.unClaimTx.burningTime).format('DD/MM/YYYY')
            }
        })
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
