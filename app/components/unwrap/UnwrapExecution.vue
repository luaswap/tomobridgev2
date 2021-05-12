<template>
    <b-container>
        <div class="steps">
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
                    <p class="steps__name">Send ERC-20 {{ fromWrapSelected.symbol || '' }}</p>
                    <p class="steps__number"><span>3</span></p>
                </b-col>
            </b-row>
        </div>
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
import UnWrapStepOne from './UnwrapStepOne'
import UnWrapStepTwo from './UnwrapStepTwo'
import UnWrapStepThree from './UnwrapStepThree'

export default {
    name: 'App',
    components: {
        UnWrapStepOne,
        UnWrapStepTwo,
        UnWrapStepThree
    },
    data () {
        return {
            step: 2,
            fromWrapSelected: this.$route.params.fromWrapSelected || {},
            recAddress: this.$route.params.recAddress || '',
            config: this.$store.state.config || {},
            amount: this.$route.params.amount || {},
            address: this.$store.state.address || '',
            expireTime: '',
            loading: false,
            transactionHash: ''
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
