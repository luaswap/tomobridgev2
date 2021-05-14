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
                                <span>Wrapped Tokens on TomoChain</span>
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
                                        src="/app/assets/images/ethereum.svg"
                                        class="logo-icon">
                                </p>
                                <span>ERC-20 Tokens on Ethereum</span>
                            </div>
                        </a>
                        <a
                            class="row btn-tm mt-5"
                            @click="redirect('wrapErc20')">
                            <div class="col-5 px-0 text-center">
                                <p>
                                    <img
                                        src="/app/assets/images/ethereum.svg"
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
            ethIds: [1, 3, 4, 5],
            tomoIds: [88, 89, 99]
        }
    },
    computed: {
        address: {
            get () {
                return this.$store.getters.address
            },
            set () {}
        },
        network: {
            get () {
                return this.$store.getters.network
            },
            set () {}
        }
    },
    async updated () {
    },
    destroyed () { },
    created: async function () {
    },
    methods: {
        redirect (product) {
            switch (product) {
            case 'unwrapErc20':
                if (!this.$store.state.address) {
                    this.$store.state.redirectTo = 'unwrap'
                    this.$refs.loginModal.show()
                } else {
                    if (this.tomoIds.indexOf(this.network.chainId) > -1) {
                        this.$router.push({ path: 'unwrap' })
                    } else { this.$toasted.show('Need TomoChain network to unwrap', { type: 'error' }) }
                }
                break
            case 'wrapErc20':
                if (!this.$store.state.address) {
                    this.$store.state.redirectTo = 'wrap'
                    this.$refs.loginModal.show()
                } else {
                    if (this.ethIds.indexOf(this.network.chainId) > -1) {
                        this.$router.push({ path: 'wrap' })
                    } else { this.$toasted.show('Need Ethereum network to wrap', { type: 'error' }) }
                }
                break
            default:
                break
            }
        }
    }
}
</script>
