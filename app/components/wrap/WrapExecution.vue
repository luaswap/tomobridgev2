<template>
    <div class="container">
        <b-container
            class="container-medium">
            <div class="open-product text-center">
                <h1 class="title-tmp-large">
                    PLEASE KEEP THIS WINDOW OPEN
                </h1>
                <p class="txt-dec">
                    You need to approve the request on MetaMask to complete the transaction
                </p>
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
                        <p class="steps__name">SEND REQUEST {{ fromWrapSelected.name || '' }}</p>
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
                            <b-img
                                src="/app/assets/images/icon-send-token.svg"
                                alt="Send Token"/>
                        </p>
                        <p class="steps__name">SEND TOKEN {{ fromWrapSelected.name || '' }}</p>
                    </b-col>
                </b-row>
            </div>
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
import WrapStepOne from './WrapStepOne'
import WrapStepTwo from './WrapStepTwo'
import WrapStepThree from './WrapStepThree'

export default {
    name: 'App',
    components: {
        WrapStepOne,
        WrapStepTwo,
        WrapStepThree
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
            outTx: {}
        }
    },
    computed: {
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
