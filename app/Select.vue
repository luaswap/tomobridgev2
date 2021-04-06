<template>
    <b-container>
        <div
            class="text-center pb-4 mb-2">
            <h2>Select conversion direction</h2>
        </div>

        <div
            class="item-product">
            <div class="box-btn">
                <b-form-group class="row btn-tm">
                    <b-form-radio-group>
                        <b-form-radio>
                            <div
                                class="row">
                                <div class="col-5 px-0 text-center">
                                    TomoChain<br><span>TomoChain Wrapped Tokens</span>
                                </div>
                                <div class="col-2 text-center">
                                    <b-icon
                                        class="light-h"
                                        icon="arrow-right"
                                        font-scale="1.5"/>
                                </div>
                                <div class="col-5 px-0 text-center">
                                    Ethereum<br><span>ERC-20 Tokens</span>
                                </div>
                            </div>
                        </b-form-radio>
                    </b-form-radio-group>
                </b-form-group>
                <a
                    class="row btn-tm"
                    @click="redirect('tomoe')">
                    <div class="col-5 px-0 text-center">
                        TomoChain<br><span>TomoChain Wrapped Tokens</span>
                    </div>
                    <div class="col-2 text-center">
                        <b-icon
                            class="light-h"
                            icon="arrow-right"
                            font-scale="1.5"/>
                    </div>
                    <div class="col-5 px-0 text-center">
                        Ethereum<br><span>ERC-20 Tokens</span>
                    </div>
                </a>
                <a
                    class="row btn-tm"
                    @click="redirect('tomoe')">
                    <div class="col-5 px-0 text-center">
                        Ethereum<br><span>ERC-20 Tokens</span>
                    </div>
                    <div class="col-2 text-center">
                        <b-icon
                            class="light-h"
                            icon="arrow-right"
                            font-scale="1.5"/>
                    </div>
                    <div class="col-5 px-0 text-center">
                        TomoChain<br><span>TomoChain Wrapped Tokens</span>
                    </div>
                </a>
            </div>
        </div>
        <div class="text-center">
            <p>
                Make sure to set your network to Ethereum
            </p>
            <div class="step-one__buttons">
                <b-button
                    class="btn--big"
                    @click="back">Back</b-button>
                <b-button
                    class="btn--big"
                    variant="primary"
                    @click="nextStep">Next</b-button>
            </div>
        </div>
        <!-- <div class="position-absolute bottom-0 mb-5">
            <div class="row text-center tomo-footer">
                <div class="">
                    <div class="tomo-meta-links text-center">
                        <ul class="p-0 m-0">
                            <li>
                                <a
                                    :target="provider === 'tomowallet' ? '' : '_blank'"
                                    href="https://forms.gle/cU1XU3b8EUMxB6yA6">
                                    Submit a request</a>
                            </li>
                            <li>
                                <a
                                    :target="provider === 'tomowallet' ? '' : '_blank'"
                                    href="https://docs.tomochain.com/tomobridge/faq">
                                    FAQ</a>
                            </li>
                            <li>
                                <a
                                    :target="provider === 'tomowallet' ? '' : '_blank'"
                                    href="https://docs.tomochain.com/tomobridge/fee-structure">
                                    Fee Structure</a>
                            </li>
                            <li>
                                <a
                                    :target="provider === 'tomowallet' ? '' : '_blank'"
                                    href="https://docs.tomochain.com/tomobridge/trc21-wrapped-token-information">
                                    TRC21 Wrapped Tokens</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div> -->
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
