<template>
    <b-modal
        id="claimModal"
        ref="claimModal"
        centered
        scrollable
        no-close-on-backdrop
        hide-footer>
        <template
            #modal-header>
            <b-button
                size="sm"
                class="close"
                @click="closeModal">
                <b-img
                    src="/app/assets/images/close.svg"
                    alt="TomoBridge"/>
            </b-button>
        </template>
        <b-container>
            <div class="text-center mb-5">
                <img
                    src="/app/assets/images/icon-time.svg"
                    alt="Metamask">
            </div>
            <h2 class="title-tmp-medium text-center">You have a pending transaction!</h2>
            <p class="text-center">Timestamp: {{ dateTime }}</p>

            <div class="claim-modal">
                <b-row>
                    <b-col cols="6">
                        <b-form-group
                            class="font-weight-bold"
                            label="Token name">
                            <div class="infor-detail">
                                <img
                                    v-if="coinImg"
                                    :src="coinImg"
                                    class="claim_img">
                                {{ (unClaimTx.coin || '').toUpperCase() }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col cols="6">
                        <b-form-group
                            class="font-weight-bold overflow-hidden"
                            label="Amount">
                            <div class="infor-detail">
                                {{ unClaimTx.amount }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col cols="12">
                        <b-form-group
                            class="font-weight-bold"
                            label="Approved burn TxHash">
                            <a
                                class="infor-detail"
                                :href="burnTxUrl"
                                target="_blank">
                                {{ truncate(unClaimTx.burnTx || '', 30) }}
                            </a>
                        </b-form-group>
                    </b-col>
                </b-row>
            </div>
            <div
                class="mt-2">
                <b-button
                    class="btn-green w-100"
                    @click="claim">Claim {{ (unClaimTx.coin || '').toUpperCase() }}</b-button>
            </div>
        </b-container>
        <div
            :class="(loading ? 'tomo-loading' : '')"/>
    </b-modal>
</template>

<script>
import urljoin from 'url-join'
import moment from 'moment'
import axios from 'axios'
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
            dateTime: '',
            coinImg: '',
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
        }
    },
    watch: {
        unClaimTx: function () {
            const config = this.config
            if (this.unClaimTx && this.unClaimTx.burnTx) {
                this.burnTxUrl = urljoin(
                    this.config.tomoscanUrl,
                    'txs',
                    this.unClaimTx.burnTx
                )
                this.dateTime = moment(this.unClaimTx.createdAt).format('DD/MM/YYYY')
                this.coinImg = config.objSwapCoin[this.unClaimTx.coin].image
            }
        }
    },
    validations: { },
    async updated () {
    },
    destroyed () { },
    created: async function () {
        const config = this.config

        if (this.unClaimTx && this.unClaimTx.burnTx) {
            this.burnTxUrl = urljoin(
                this.config.tomoscanUrl,
                'txs',
                this.unClaimTx.burnTx
            )
            this.dateTime = moment(this.unClaimTx.createdAt).format('DD/MM/YYYY')
            this.coinImg = config.objSwapCoin[this.unClaimTx.coin].image
        }
    },
    methods: {
        show () {
            this.$refs.claimModal.show()
        },
        closeModal () {
            this.$store.state.address = ''
            this.$store.state.network = ''
            if (this.$route.path !== '/select') {
                this.$router.push({
                    path: '/select'
                })
            }
            this.$refs.claimModal.hide()
        },
        hide () {
            this.$refs.claimModal.hide()
        },
        async scanTX () {
            try {
                const txData = await axios.get(
                    `/api/wrap/getTransaction/${this.unClaimTx.burnTx}`
                )
                if (txData && txData.data) {
                    return txData.data
                }
            } catch (error) {
                console.log(error)
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        },
        async claim () {
            this.loading = true
            const parent = this.parent
            try {
                const config = this.config
                let data = await this.scanTX()

                if (data && data.transaction) {
                    const outTx = data.transaction.OutTx
                    let signatureBytes = []
                    if (outTx.Hash === this.unClaimTx.burnTx &&
                        outTx.Status.toLowerCase() === 'signed_on_hub' && outTx.Signature) {
                        signatureBytes = this.web3Eth.utils.hexToBytes(outTx.Signature)
                    }

                    const contract = new this.web3Eth.eth.Contract(
                        this.ContractBridgeEthAbi.abi,
                        config.blockchain.contractBridgeEth
                    )

                    const isClaim = await contract.methods.usedNonce(signatureBytes).call()
                    if (!isClaim) {
                        const coinObj = this.config.objSwapCoin
                        this.hide()
                        this.$router.push({
                            name: 'UnwrapExecution',
                            params: {
                                recAddress: this.unClaimTx.receivingAddress,
                                amount: this.unClaimTx.amount,
                                fromWrapSelected: coinObj[this.unClaimTx.coin],
                                isClaimable: true
                            }
                        })
                    } else {
                        this.loading = false
                        this.hide()
                        parent.$refs.claimedModal.show()
                    }
                } else {
                    const coinObj = this.config.objSwapCoin
                    this.hide()
                    this.$router.push({
                        name: 'UnwrapExecution',
                        params: {
                            recAddress: this.unClaimTx.receivingAddress,
                            amount: this.unClaimTx.amount,
                            fromWrapSelected: coinObj[this.unClaimTx.coin],
                            isClaimable: true
                        }
                    })
                }
            } catch (error) {
                this.loading = false
                this.$toasted.show(error, { type: 'error' })
            }
        }
    }
}
</script>
