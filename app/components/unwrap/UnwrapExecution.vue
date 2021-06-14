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
                    <h1
                        class="title-tmp-large">
                        PLEASE KEEP THIS WINDOW OPEN
                    </h1>
                    <!-- <p class="txt-red">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-exclamation-circle-fill mr-1"
                            viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                        </svg>
                        Set your Metamask network to Ethereum and make sure you have enough ETH
                    </p> -->
                    <p>
                        TomoChain TxHash:
                        <a
                            :href="txUrl"
                            target="_blank">
                            {{ transactionHash }}
                        </a>
                    </p>
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
                        <!-- eslint-disable -->
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
                                    fill="#393939"/>
                                <path
                                    d="M56.8 31.6H31.6V49.6H56.8V31.6Z"
                                    fill="#606060"
                                    class="light-blue"/>
                                <path
                                    d="M96.3999 71.2H71.2V89.2H96.3999V71.2Z"
                                    fill="#606060"
                                    class="light-blue"/>
                                <path
                                    d="M58.6 28H29.8C28.81 28 28 28.81 28 29.8V51.4C28 52.39 28.81 53.2 29.8 53.2H42.4V56.8H37C36.01 56.8 35.2 57.61 35.2 58.6C35.2 59.59 36.01 60.4 37 60.4H51.4C52.39 60.4 53.2 59.59 53.2 58.6C53.2 57.61 52.39 56.8 51.4 56.8H46V53.2H58.6C59.59 53.2 60.4 52.39 60.4 51.4V29.8C60.4 28.81 59.59 28 58.6 28ZM56.8 49.6H31.6V31.6H56.8V49.6Z"
                                    fill="#8B8B8B"
                                    class="dark-blue"/>
                                <path
                                    d="M98.2 67.6H69.4C68.41 67.6 67.6 68.41 67.6 69.4V91C67.6 91.99 68.41 92.8 69.4 92.8H82V96.4H76.6C75.61 96.4 74.8 97.21 74.8 98.2C74.8 99.19 75.61 100 76.6 100H91C91.99 100 92.8 99.19 92.8 98.2C92.8 97.21 91.99 96.4 91 96.4H85.6V92.8H98.2C99.19 92.8 100 91.99 100 91V69.4C100 68.41 99.19 67.6 98.2 67.6ZM96.4 89.2H71.2V71.2H96.4V89.2Z"
                                    fill="#8B8B8B"
                                    class="dark-blue"/>
                                <path
                                    d="M69.4 42.4H85.6V58.6C85.6 59.59 86.41 60.4 87.4 60.4C88.39 60.4 89.2 59.59 89.2 58.6V40.6C89.2 39.61 88.39 38.8 87.4 38.8H69.4C68.41 38.8 67.6 39.61 67.6 40.6C67.6 41.59 68.41 42.4 69.4 42.4Z"
                                    fill="#8B8B8B"
                                    class="dark-purple"/>
                                <path
                                    d="M58.6001 82H42.4V69.4C42.4 68.41 41.59 67.6 40.6 67.6C39.61 67.6 38.8 68.41 38.8 69.4V83.8C38.8 84.79 39.61 85.6 40.6 85.6H58.6001C59.5901 85.6 60.4001 84.79 60.4001 83.8C60.4001 82.81 59.5901 82 58.6001 82Z"
                                    fill="#8B8B8B"
                                    class="dark-purple"/>
                            </svg>
                        </p>
                        <!-- eslint-enable -->
                        <p class="steps__name">SEND REQUEST</p>
                    </b-col>
                    <b-col
                        :class="{
                            'steps__col--current' : step === 2,
                            'steps__col--active' : step >= 2,
                        }"
                        class="steps__col">
                        <!-- eslint-disable -->
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
                                    fill="#393939"/>
                                <path
                                    d="M63.6192 36C58.2072 41.4601 47.2549 44.4383 38 44.7586V63.989C38 79.6327 51.6903 89.2079 63.6192 92.7466C75.5482 89.2079 89.2384 79.6327 89.2384 63.989V44.7586C79.9835 44.4383 69.0313 41.4601 63.6192 36Z"
                                    fill="#606060"
                                    class="light-blue"/>
                                <path
                                    d="M91.042 41.5591C81.723 41.5591 69.4739 38.4208 65.1026 32.5924C64.4941 31.7918 63.1491 31.7918 62.5407 32.5924C58.1694 38.4208 45.9202 41.5591 36.6012 41.5591C35.7205 41.5591 35 42.2797 35 43.1603V63.9759C35 81.5891 50.2915 92.2051 63.3733 95.9519C63.5174 95.9839 63.6775 96 63.8216 96C63.9657 96 64.1258 95.9839 64.27 95.9519C77.3518 92.2051 92.6432 81.5891 92.6432 63.9759V43.1603C92.6432 42.2797 91.9227 41.5591 91.042 41.5591ZM89.4408 63.9759C89.4408 79.6197 75.7506 89.1949 63.8216 92.7335C51.8927 89.1949 38.2024 79.6197 38.2024 63.9759V44.7455C47.4573 44.4253 58.4096 41.447 63.8216 35.9869C69.2337 41.447 80.1859 44.4253 89.4408 44.7455V63.9759Z"
                                    fill="#8B8B8B"
                                    class="dark-blue"/>
                                <path
                                    d="M56 65L61 70L72 59"
                                    stroke="#8B8B8B"
                                    stroke-width="4"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="stroke-dark-purple"/>
                                <defs>
                                    <clipPath id="clip0">
                                        <rect
                                            width="57.6432"
                                            height="64"
                                            fill="white"
                                            transform="translate(35 32)"/>
                                    </clipPath>
                                </defs>
                            </svg>

                        </p>
                        <!-- eslint-enable -->
                        <p class="steps__name">
                            VERIFY {{ step === 2 ? `${confirmation}/${requiredConfirm} Confirmations` : 'TRANSACTION' }}
                        </p>
                    </b-col>
                    <b-col
                        :class="{
                            'steps__col--current' : step === 3,
                            'steps__col--active' : step >= 3,
                        }"
                        class="steps__col">
                        <!-- eslint-disable -->
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
                                    fill="#393939"/>
                                <path
                                    d="M79.8 72.9998C91.7294 72.9998 101.4 63.3292 101.4 51.3998C101.4 39.4705 91.7294 29.7998 79.8 29.7998C67.8707 29.7998 58.2 39.4705 58.2 51.3998C58.2 63.3292 67.8707 72.9998 79.8 72.9998Z"
                                    fill="#606060"
                                    class="light-purple"/>
                                <path
                                    d="M47.4 96.3998C58.3352 96.3998 67.2 87.535 67.2 76.5998C67.2 65.6646 58.3352 56.7998 47.4 56.7998C36.4647 56.7998 27.6 65.6646 27.6 76.5998C27.6 87.535 36.4647 96.3998 47.4 96.3998Z"
                                    fill="#606060"
                                    class="light-blue"/>
                                <path
                                    d="M75.57 74.404C77.01 74.674 78.432 74.8 79.8 74.8C92.706 74.8 103.2 64.306 103.2 51.4C103.2 38.494 92.706 28 79.8 28C67.542 28 57.3 37.594 56.472 49.834C56.4 50.824 57.156 51.688 58.146 51.742C59.136 51.814 60 51.058 60.054 50.068C60.756 39.718 69.432 31.6 79.8 31.6C90.726 31.6 99.6 40.474 99.6 51.4C99.6 62.326 90.726 71.2 79.8 71.2C78.63 71.2 77.46 71.092 76.218 70.858C75.246 70.696 74.31 71.326 74.13 72.298C73.95 73.27 74.598 74.224 75.57 74.404Z"
                                    fill="#8B8B8B"
                                    class="dark-purple"/>
                                <path
                                    d="M47.4 53.2002C34.494 53.2002 24 63.6942 24 76.6002C24 89.5062 34.494 100 47.4 100C60.306 100 70.8 89.5062 70.8 76.6002C70.8 63.6942 60.306 53.2002 47.4 53.2002ZM47.4 96.4002C36.474 96.4002 27.6 87.5082 27.6 76.6002C27.6 65.6742 36.474 56.8002 47.4 56.8002C58.326 56.8002 67.2 65.6742 67.2 76.6002C67.2 87.5082 58.326 96.4002 47.4 96.4002Z"
                                    fill="#8B8B8B"
                                    class="dark-blue"/>
                                <path
                                    d="M33 49.5998C33.99 49.5998 34.8 48.7898 34.8 47.7998V38.7998H46.662L46.14 39.3218C45.438 40.0238 45.438 41.1578 46.14 41.8598C46.482 42.2198 46.932 42.3998 47.4 42.3998C47.868 42.3998 48.318 42.2198 48.678 41.8778L52.278 38.2778C52.98 37.5758 52.98 36.4418 52.278 35.7398L48.678 32.1398C47.976 31.4378 46.842 31.4378 46.14 32.1398C45.438 32.8418 45.438 33.9758 46.14 34.6778L46.662 35.1998H33C32.01 35.1998 31.2 36.0098 31.2 36.9998V47.7998C31.2 48.7898 32.01 49.5998 33 49.5998Z"
                                    fill="#8B8B8B"
                                    class="dark-blue"/>
                                <path
                                    d="M95.478 78.922C94.776 78.22 93.642 78.22 92.94 78.922L89.34 82.522C88.638 83.224 88.638 84.358 89.34 85.06C90.042 85.762 91.176 85.762 91.878 85.06L92.4 84.538V89.2H76.2C75.21 89.2 74.4 90.01 74.4 91C74.4 91.99 75.21 92.8 76.2 92.8H94.2C95.19 92.8 96 91.99 96 91V84.538L96.522 85.06C96.882 85.42 97.332 85.6 97.8 85.6C98.268 85.6 98.718 85.42 99.078 85.078C99.78 84.376 99.78 83.242 99.078 82.54L95.478 78.922Z"
                                    fill="#8B8B8B"
                                    class="dark-blue"/>
                                <defs>
                                    <clipPath id="clip0">
                                        <rect
                                            width="79.2"
                                            height="72"
                                            fill="white"
                                            transform="translate(24 28)"/>
                                    </clipPath>
                                </defs>
                            </svg>

                        </p>
                        <!-- eslint-enable -->
                        <p class="steps__name">
                            SEND {{ fromWrapSelected.symbol.toLowerCase() !== 'eth' ? `ERC-20 ${fromWrapSelected.symbol}` : 'ETH native' }}
                        </p>
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
    </div>
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
            step: 2,
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
            txUrl: '',
            requiredConfirm: 30,
            confirmation: 0
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
