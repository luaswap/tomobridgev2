<template>
    <div class="container">
        <b-container
            class="container-medium">
            <div class="open-product text-center">
                <h1 class="title-tmp-large">
                    SELECT A BRIDGE
                </h1>
                <p class="txt-dec">Cross-chain portal to transfer assets between TomoChain and other Blockchains</p>

                <b-form-checkbox
                    v-model="isAgreed"
                    unchecked-value="not_accepted">
                    I agree to the
                    <b-link
                        href="https://docs.tomochain.com/tomobridge/terms-of-use"
                        class="text-blue">
                        Terms of use
                    </b-link>
                    and
                    <b-link
                        href="https://docs.tomochain.com/tomobridge/privacy-policy"
                        class="text-blue">
                        Privacy policy
                    </b-link>
                </b-form-checkbox>
                <p
                    v-if="checkError"
                    class="error my-2">
                    <b-icon
                        class="mr-2 m1 light-h"
                        icon="exclamation-circle"
                        font-scale="1"/>Please indicate that you have read and agreed to the Terms of Use and Privacy Policy
                </p>
            </div>
            <div class="item-product">
                <div class="box-btn">
                    <a
                        class="row btn-tm"
                        @click="redirect('tomoe')">
                        <div class="col-5 px-0 text-right">
                            TOMO<br><span>TomoChain</span>
                        </div>
                        <div class="col-2 text-center">
                            <b-icon
                                class="light-h"
                                icon="arrow-left-right"
                                font-scale="1.5"/>
                        </div>
                        <div class="col-5 px-0">
                            TOMOE - ERC20<br><span>Ethereum</span>
                        </div>
                    </a>
                    <a
                        v-if="!mobileCheck"
                        class="row btn-tm"
                        @click="redirect('tomob')">
                        <div class="col-5 px-0 text-right">
                            TOMO<br><span>TomoChain</span>
                        </div>
                        <div class="col-2 text-center">
                            <b-icon
                                class="light-h"
                                icon="arrow-left-right"
                                font-scale="1.5"/>
                        </div>
                        <div class="col-5 px-0">
                            TOMOB - BEP2<br><span>Binance Chain</span>
                        </div>
                    </a>
                    <a
                        class="row btn-tm"
                        @click="redirect('sollet')">
                        <div class="col-5 px-0 text-right">
                            LUA & TOMOE - ERC20<br><span>Ethereum</span>
                        </div>
                        <div class="col-2 text-center">
                            <b-icon
                                class="light-h"
                                icon="arrow-left-right"
                                font-scale="1.5"/>
                        </div>
                        <div class="col-5 px-0">
                            WRAPPED LUA & TOMO - SPL<br><span>Solana</span>
                        </div>
                    </a>
                    <a
                        class="row btn-tm"
                        @click="redirect('bridge')">
                        <div class="col-5 px-0 text-right">
                            Tokens<br><span>on other chains</span>
                        </div>
                        <div class="col-2 text-center">
                            <b-icon
                                class="light-h"
                                icon="arrow-left-right"
                                font-scale="1.5"/>
                        </div>
                        <div class="col-5 px-0">
                            TRC21 tokens<br><span>on TomoChain</span>
                        </div>
                    </a>
                </div>
            </div>
        </b-container>
    </div>
</template>

<script>

export default {
    name: 'App',
    components: {
    },
    data () {
        return {
            checkError: false,
            isAgreed: false
        }
    },
    computed : {
        mobileCheck: () => {
            const isAndroid = navigator.userAgent.match(/Android/i)
            const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i)
            return (isAndroid || isIOS)
        }
    },
    async updated () { },
    destroyed () {
    },
    created: async function () { },
    methods: {
        redirect (product) {
            if (!this.isAgreed) {
                this.checkError = true
            } else {
                switch (product) {
                case 'bridge':
                    this.$router.push({ path: '/select' })
                    break
                case 'tomob':
                    this.isAgreed = false
                    window.location.href = 'https://tomob.tomochain.com'
                    break
                case 'tomoe':
                    this.isAgreed = false
                    window.location.href = 'https://tomoe.tomochain.com'
                    break
                case 'sollet':
                    this.isAgreed = false
                    window.location.href = 'https://www.sollet.io'
                    break
                default:
                    break
                }
            }
        }
    }
}
</script>
