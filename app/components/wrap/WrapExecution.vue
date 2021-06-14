<template>
    <div class="container">
        <b-container
            class="container-medium">
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

            <div class="steps">
                <b-row class="steps__row">
                    <b-col
                        :class="{
                            'steps__col--current' : step === 1,
                            'steps__col--active' : step >= 1,
                        }"
                        class="steps__col">
                        <p class="steps__number">
                            <b-img
                                src="/app/assets/images/icon-send-request.svg"
                                alt="Send Request"/>
                        </p>
                        <p class="steps__name">SEND REQUEST</p>
                    </b-col>
                    <b-col
                        :class="{
                            'steps__col--current' : step === 2,
                            'steps__col--active' : step >= 2,
                        }"
                        class="steps__col">
                        <p class="steps__number">
                            <b-img
                                src="/app/assets/images/icon-verify-transaction.svg"
                                alt="Verify Transaction"/>
                        </p>
                        <p class="steps__name">VERIFY TRANSACTION</p>
                    </b-col>
                    <b-col
                        :class="{
                            'steps__col--current' : step === 3,
                            'steps__col--active' : step >= 3,
                        }"
                        class="steps__col">
                        <p class="steps__number">
                            <svg
                                width="128"
                                height="128"
                                viewBox="0 0 128 128"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="64"
                                    fill="#353535"/>
                                <g clip-path="url(#clip0)">
                                    <!-- eslint-disable -->
                                    <path
                                        class="path1"
                                        d="M83.8 73C95.7294 73 105.4 63.3294 105.4 51.4C105.4 39.4707 95.7294 29.8 83.8 29.8C71.8707 29.8 62.2 39.4707 62.2 51.4C62.2 63.3294 71.8707 73 83.8 73Z"
                                        fill="#606060"/>
                                    <path
                                        class="path2"
                                        d="M51.4 96.4C62.3352 96.4 71.2 87.5352 71.2 76.6C71.2 65.6648 62.3352 56.8 51.4 56.8C40.4647 56.8 31.6 65.6648 31.6 76.6C31.6 87.5352 40.4647 96.4 51.4 96.4Z"
                                        fill="#606060"/>
                                    <path
                                        class="path3"
                                        d="M79.57 74.404C81.01 74.674 82.432 74.8 83.8 74.8C96.706 74.8 107.2 64.306 107.2 51.4C107.2 38.494 96.706 28 83.8 28C71.542 28 61.3 37.594 60.472 49.834C60.4 50.824 61.156 51.688 62.146 51.742C63.136 51.814 64 51.058 64.054 50.068C64.756 39.718 73.432 31.6 83.8 31.6C94.726 31.6 103.6 40.474 103.6 51.4C103.6 62.326 94.726 71.2 83.8 71.2C82.63 71.2 81.46 71.092 80.218 70.858C79.246 70.696 78.31 71.326 78.13 72.298C77.95 73.27 78.598 74.224 79.57 74.404Z"
                                        fill="#8B8B8B"/>
                                    <path
                                        class="path4"
                                        d="M51.4 53.2C38.494 53.2 28 63.694 28 76.6C28 89.506 38.494 100 51.4 100C64.306 100 74.8 89.506 74.8 76.6C74.8 63.694 64.306 53.2 51.4 53.2ZM51.4 96.4C40.474 96.4 31.6 87.508 31.6 76.6C31.6 65.674 40.474 56.8 51.4 56.8C62.326 56.8 71.2 65.674 71.2 76.6C71.2 87.508 62.326 96.4 51.4 96.4Z"
                                        fill="#8B8B8B"/>
                                    <path
                                        class="path5"
                                        d="M37 49.6C37.99 49.6 38.8 48.79 38.8 47.8V38.8H50.662L50.14 39.322C49.438 40.024 49.438 41.158 50.14 41.86C50.482 42.22 50.932 42.4 51.4 42.4C51.868 42.4 52.318 42.22 52.678 41.878L56.278 38.278C56.98 37.576 56.98 36.442 56.278 35.74L52.678 32.14C51.976 31.438 50.842 31.438 50.14 32.14C49.438 32.842 49.438 33.976 50.14 34.678L50.662 35.2H37C36.01 35.2 35.2 36.01 35.2 37V47.8C35.2 48.79 36.01 49.6 37 49.6Z"
                                        fill="#8B8B8B"/>
                                    <path
                                        class="path6"
                                        d="M99.478 78.922C98.776 78.22 97.642 78.22 96.94 78.922L93.34 82.522C92.638 83.224 92.638 84.358 93.34 85.06C94.042 85.762 95.176 85.762 95.878 85.06L96.4 84.538V89.2H80.2C79.21 89.2 78.4 90.01 78.4 91C78.4 91.99 79.21 92.8 80.2 92.8H98.2C99.19 92.8 100 91.99 100 91V84.538L100.522 85.06C100.882 85.42 101.332 85.6 101.8 85.6C102.268 85.6 102.718 85.42 103.078 85.078C103.78 84.376 103.78 83.242 103.078 82.54L99.478 78.922Z"
                                        fill="#8B8B8B"/>
                                    <!-- eslint-disable -->
                                </g>
                                <defs>
                                    <clipPath id="clip0">
                                        <rect
                                            width="79.2"
                                            height="72"
                                            fill="white"
                                            transform="translate(28 28)"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </p>
                        <p class="steps__name">SEND TOKEN {{ fromWrapSelected.name || '' }}</p>
                    </b-col>
                </b-row>
            </div>
            <TransactionDetails :parent="this"/>
            <div v-if="step === 1">
                <WrapStepOne :parent="this"/>
            </div>
            <div v-if="step === 2">
                <WrapStepTwo :parent="this"/>
            </div>
            <div v-if="step === 3">
                <WrapStepThree :parent="this"/>
            </div>
        </b-container>
    </div>
</template>

<script>
import urljoin from 'url-join'
import WrapStepOne from './WrapStepOne'
import WrapStepTwo from './WrapStepTwo'
import WrapStepThree from './WrapStepThree'
import TransactionDetails from '../TransactionDetails'

export default {
    name: 'App',
    components: {
        WrapStepOne,
        WrapStepTwo,
        WrapStepThree,
        TransactionDetails
    },
    data () {
        return {
            step: 1,
            fromWrapSelected: this.$route.params.fromWrapSelected || {},
            recAddress: this.$route.params.recAddress || '',
            config: this.$store.state.config || {},
            depAmount: this.$route.params.depAmount || {},
            expireTime: '',
            address: this.$store.state.address,
            transactionHash: '',
            outTx: {},
            txUrl: ''
        }
    },
    computed: {
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
    },
    methods: {}
}
</script>
