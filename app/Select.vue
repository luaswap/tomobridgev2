<template>
    <b-container>
        <b-row align-h="center">
            <b-col cols="7">
                <div
                    class="text-center pb-4 mb-2">
                    <h2>Select conversion direction</h2>
                    <p class="text-d">Make sure to set your network to Ethereum</p>
                </div>

                <div
                    class="item-product">
                    <div class="box-btn">
                        <a
                            class="row btn-tm"
                            @click="redirect('tomoe')">
                            <div class="col-5 px-0 text-center">
                                <p>
                                    <img
                                        src="/app/assets/images/logo-tomochain.png"
                                        class="logo-icon">
                                </p>
                                <span>TomoChain Wrapped Tokens</span>
                            </div>
                            <div class="col-2 text-center">
                                <b-icon
                                    class="light-h"
                                    icon="arrow-right-short"
                                    font-scale="3"/>
                            </div>
                            <div class="col-5 px-0 text-center">
                                <p>
                                    <img
                                        src="/app/assets/images/logo-ether.png"
                                        class="logo-icon">
                                </p>
                                <span>ERC-20 Tokens</span>
                            </div>
                        </a>
                        <a
                            class="row btn-tm mt-5"
                            @click="redirect('tomoe')">
                            <div class="col-5 px-0 text-center">
                                <p>
                                    <img
                                        src="/app/assets/images/logo-ether.png"
                                        class="logo-icon">
                                </p>
                                <span>ERC-20 Tokens</span>
                            </div>
                            <div class="col-2 text-center">
                                <b-icon
                                    class="light-h"
                                    icon="arrow-right-short"
                                    font-scale="3"/>
                            </div>
                            <div class="col-5 px-0 text-center">
                                <p>
                                    <img
                                        src="/app/assets/images/logo-tomochain.png"
                                        class="logo-icon">
                                </p>
                                <span>TomoChain Wrapped Tokens</span>
                            </div>
                        </a>
                    </div>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name: 'App',
    components: {
    },
    data () {
        return {
        }
    },
    computed: {
    },
    async updated () {
    },
    destroyed () { },
    created: async function () {
    },
    methods: {
    }
}
</script>
