<template>
    <b-container class="step-one text-center">
        <p class="text-danger">You need to sign the request on MetaMask to activate the withdrawal request</p>
        <p>Your withdrawal request has been successfully approved</p>
        <div class="mt-5">
            <p>Please keep this window open</p>
            <div class="text-center">
                <b-button
                    class="btn--big st-next m-auto">
                    Transaction pending
                </b-button>
            </div>
        </div>
    </b-container>
</template>

<script>
export default {
    name: 'App',
    components: {
    },
    props: {
        parent: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            addressQRCode: '',
            depositAddress: '',
            tokenName: '',
            fromToken: {},
            config: {},
            minimumDeposit: 0
        }
    },
    async updated () { },
    destroyed () { },
    created: async function () {
    },
    methods: {
    }
}
</script>
