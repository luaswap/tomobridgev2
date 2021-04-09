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
                    <p class="steps__name">Send Request {{ fromWrapToken.name || '' }}</p>
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
                    <p class="steps__name">Send TomoChain wrapped USDT {{ toWrapToken.name || '' }} {{ fromWrapToken.name || '' }}</p>
                    <p class="steps__number"><span>3</span></p>
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
            step: 3,
            fromWrapToken: {},
            toWrapToken: {},
            receiveAddress: this.$route.params.receiveAddress || '',
            config: {},
            expireTime: ''
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
