<template>
    <b-container>
        <div class="steps">
            <div class="open-product text-center">
                <div v-if="step === 1">
                    <h1
                        class="title-tmp-large">
                        PLEASE KEEP THIS WINDOW OPEN
                    </h1>
                    <p class="txt-dec">
                        You need to approve the request on MetaMask to complete the transaction
                    </p>
                </div>
                <div v-if="step === 2">
                    <h1>
                        VERIFYING
                    </h1>
                </div>
                <div v-if="step === 3">
                    <h1
                        class="title-tmp-large">
                        SUCCESSFULLY CONVERTED ASSETS!
                    </h1>
                    <p class="txt-dec">
                        Check TomoChain burned TxHash
                        <a :href="txUrl">here</a>
                    </p>
                </div>
            </div>
            <b-row class="align-items-center steps__row">
                <b-col
                    :class="{
                        'steps__col--current' : step === 1,
                        'steps__col--active' : step >= 1,
                    }"
                    class="steps__col">
                    <p class="steps__name">
                        Send Request</p>
                    <p class="steps__number"><span>1</span></p>
                </b-col>
                <b-col
                    :class="{
                        'steps__col--current' : step === 2,
                        'steps__col--active' : step >= 2,
                    }"
                    class="steps__col">
                    <p class="steps__name">Verify Transaction</p>
                    <p class="steps__number"><span>2</span></p>
                </b-col>
                <b-col
                    :class="{
                        'steps__col--current' : step === 3,
                        'steps__col--active' : step >= 3,
                    }"
                    class="steps__col">
                    <p class="steps__name">
                        Send {{ fromWrapSelected.symbol.toLowerCase() !== 'eth' ? `ERC-20 ${fromWrapSelected.symbol}` : 'ETH native' }}
                    </p>
                    <p class="steps__number"><span>3</span></p>
                </b-col>
            </b-row>
        </div>
        <TransactionDetails :parent="this"/>
        <div v-if="step === 1">
            <UnWrapStepOne :parent="this"/>
        </div>
        <div v-if="step === 2">
            <UnWrapStepTwo :parent="this"/>
        </div>
        <div v-if="step === 3">
            <UnWrapStepThree :parent="this"/>
        </div>
        <div
            :class="(loading ? 'tomo-loading' : '')"/>
    </b-container>
</template>

<script>
import urljoin from 'url-join'
import UnWrapStepOne from './UnwrapStepOne'
import UnWrapStepTwo from './UnwrapStepTwo'
import UnWrapStepThree from './UnwrapStepThree'
import TransactionDetails from '../TransactionDetails'

export default {
    name: 'App',
    components: {
        UnWrapStepOne,
        UnWrapStepTwo,
        UnWrapStepThree,
        TransactionDetails
    },
    data () {
        return {
            step: 1,
            fromWrapSelected: this.$route.params.fromWrapSelected || {},
            recAddress: this.$route.params.recAddress || '',
            config: this.$store.state.config || {},
            amount: this.$route.params.amount || {},
            isClaimable: this.$route.params.isClaimable,
            address: this.$store.state.address || '',
            expireTime: '',
            loading: false,
            transactionHash: '',
            claimTxHash: '',
            txUrl: ''
        }
    },
    watch: {
        transactionHash: function () {
            this.txUrl = urljoin(
                this.config.tomoscanUrl,
                'txs',
                this.transactionHash
            )
        }
    },
    async updated () {
    },
    destroyed () {
    },
    created: async function () {
        if (this.isClaimable) {
            const unClaimTx = this.$store.state.unClaimTx
            this.transactionHash = unClaimTx.burnTx
            this.step = 2
        }
    },
    methods: {}
}
</script>
