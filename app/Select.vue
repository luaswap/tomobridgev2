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
                            @click="redirect('unwrapErc20')">
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
                            @click="redirect('wrapErc20')">
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
        <LoginModal
            ref="loginModal"
            :parent="this"/>
    </b-container>
</template>

<script>
import LoginModal from './components/modals/Login'
export default {
    name: 'App',
    components: {
        LoginModal
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
        redirect (product) {
            switch (product) {
            case 'wrapErc20':
                if (!this.$store.state.address) {
                    this.$store.state.redirectTo = 'wrap'
                    this.$refs.loginModal.show()
                } else {
                    this.$router.push({ path: 'wrap' })
                }
                break
            case 'unwrapErc20':
                if (!this.$store.state.address) {
                    this.$store.state.redirectTo = 'unwrap'
                    this.$refs.loginModal.show()
                } else {
                    this.$router.push({ path: 'unwrap' })
                }
                break
            default:
                break
            }
        }
    }
}
</script>
