<template>
    <b-container>
        <div
            v-if="!address"
            class="login-wallet mb-4">
            <div
                class="connect">
                <div id="login">
                    <div class="login__buttons">
                        <div class="txt-infor">
                            <p class="txt-dec mb-1">Connect wallet to continue</p>
                            <div class="">
                                <img
                                    src="/app/assets/images/metamask.png"
                                    alt="Metamask">
                                <span class="title-tmp-medium">METAMASK</span>
                            </div>
                        </div>
                        <b-button
                            @click="loginMetamask">
                            Connect now
                        </b-button>
                    </div>
                </div>
            </div>
        </div>
        <AddressInfo v-else/>
        <div class="container">
            <b-container
                class="container-medium">
                <div
                    class="text-center">
                    <h1 class="title-tmp-large">SELECT CONVERSION DIRECTION</h1>
                </div>

                <div
                    class="item-product">
                    <div class="box-btn">
                        <a
                            class="row btn-tm"
                            @click="redirect('unwrapErc20')">
                            <div class="col-5 px-0 text-right">
                                <div class="text-right">
                                    <img
                                        src="/app/assets/images/tomochain.svg"
                                        class="logo-icon mr-2">
                                    TOMOCHAIN
                                </div>
                                <span>Wrapped Tokens on TomoChain</span>
                            </div>
                            <div class="col-2 text-center">
                                <b-icon
                                    class="light-h"
                                    icon="arrow-right-short"
                                    font-scale="3"/>
                            </div>
                            <div class="col-5 px-0 text-left">
                                <div class="text-left">
                                    <img
                                        src="/app/assets/images/ethereum.svg"
                                        class="logo-icon mr-2">
                                    ETHEREUM
                                </div>
                                <span>ERC-20 Tokens on Ethereum</span>
                            </div>
                        </a>
                        <a
                            class="row btn-tm"
                            @click="redirect('wrapErc20')">
                            <div class="col-5 px-0 text-right">
                                <div class="text-right">
                                    <img
                                        src="/app/assets/images/ethereum.svg"
                                        class="logo-icon mr-2">
                                    ETHEREUM
                                </div>
                                <span>ERC-20 Tokens on Ethereum</span>
                            </div>
                            <div class="col-2 text-center">
                                <b-icon
                                    class="light-h"
                                    icon="arrow-right-short"
                                    font-scale="3"/>
                            </div>
                            <div class="col-5 px-0 text-left">
                                <div class="text-left">
                                    <img
                                        src="/app/assets/images/tomochain.svg"
                                        class="logo-icon mr-2">
                                    TOMOCHAIN
                                </div>
                                <span>TomoChain Wrapped Tokens</span>
                            </div>
                        </a>
                    </div>
                </div>
            </b-container>
        </div>
        <LoginModal
            ref="loginModal"
            :parent="this"/>
        <ClaimTokenModal
            ref="claimModal"
            :parent="this"/>
        <div
            :class="(loading ? 'tomo-loading' : '')"/>
    </b-container>
</template>

<script>
import axios from 'axios'
import Helper from './utils'
import Web3 from 'web3'
import urljoin from 'url-join'
import LoginModal from './components/modals/Login'
import ClaimTokenModal from './components/modals/ClaimToken'
import AddressInfo from './components/Address.vue'
export default {
    name: 'App',
    components: {
        LoginModal,
        ClaimTokenModal,
        AddressInfo
    },
    data () {
        return {
            ethIds: [1, 3, 4, 5],
            tomoIds: [88, 89, 99],
            loading: false,
            scanUrl: '#'
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
        },
        balance: {
            get () {
                return this.$store.getters.balance
            },
            set () {}
        },
        config: {
            get () {
                return this.$store.getters.config
            },
            set () {}
        },
        mobileCheck: () => {
            const isAndroid = navigator.userAgent.match(/Android/i)
            const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i)
            return (isAndroid || isIOS)
        }
    },
    watch: {
        address: function (value) {
            this.scanUrl = urljoin(this.config.tomoscanUrl, 'address', value)
        }
    },
    async updated () {
    },
    destroyed () { },
    created: async function () {
        if (this.address) {
            const data1 = await this.checkUnclaimTx()
            if (data1) {
                this.$store.state.unClaimTx = data1
                this.$refs.claimModal.show()
            }
        }
    },
    methods: {
        signOut () {
            this.$store.state.address = ''
            this.$store.state.network = ''
            if (this.$route.path !== '/select') {
                this.$router.push({
                    path: '/select'
                })
            }
        },
        openClaimTokenModal () {
            this.$refs.claimTokenModal.show()
        },
        redirect (product) {
            switch (product) {
            case 'unwrapErc20':
                if (!this.$store.state.address) {
                    this.$store.state.redirectTo = 'unwrap'
                    this.$toasted.show('You need to connect wallet first', { type: 'error' })
                } else {
                    if (this.tomoIds.indexOf(this.network.chainId) > -1) {
                        this.$router.push({ path: 'unwrap' })
                    } else { this.$toasted.show('Set your network to TomoChain', { type: 'error' }) }
                }
                break
            case 'wrapErc20':
                if (!this.$store.state.address) {
                    this.$store.state.redirectTo = 'wrap'
                    // this.$refs.loginModal.show()
                    this.$toasted.show('You need to connect wallet first', { type: 'error' })
                } else {
                    if (this.ethIds.indexOf(this.network.chainId) > -1) {
                        this.$router.push({ path: 'wrap' })
                    } else { this.$toasted.show('Set your network to Ethereum', { type: 'error' }) }
                }
                break
            default:
                break
            }
        },
        async checkUnclaimTx () {
            try {
                const { data } = await axios.get('/api/account/getUnclaimTx/' + this.address)
                return data
            } catch (error) {
                console.log(error)
                this.$toasted.show(error.message ? error.message : error, { type: 'error ' })
            }
        },
        async loginMetamask () {
            try {
                this.loading = true
                if (window.ethereum) {
                    this.loading = true
                    const walletProvider = window.ethereum
                    const wjs = new Web3(walletProvider)
                    await this.setupProvider('metamask', wjs)
                    // if (window.web3.currentProvider.isTomoWallet) {
                    //     await this.setupProvider('tomowallet', wjs)
                    // } else {
                    //     await this.setupProvider('metamask', wjs)
                    // }

                    const data = await this.getChainId()
                    this.$store.state.network = Helper.networks[data] || { name: 'Unknown', chainId: 0 }
                    const address = await this.getAccount()

                    this.getBalance(address).then(data => {
                        if (data) {
                            this.$store.state.balance = data.toFixed(5)
                        }
                    }).catch(error => console.log(error))

                    this.$store.state.address = address
                    this.$store.state.provider = 'metamask'

                    const data1 = await this.checkUnclaimTx()
                    if (data1) {
                        this.$store.state.unClaimTx = data1
                        this.loading = false
                        this.$refs.claimModal.show()
                    }
                    this.loading = false
                } else {
                    this.loading = false
                    this.$toasted.show('Please install Metamask', { type: 'error' })
                }
            } catch (error) {
                this.loading = false
                console.log(error)
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        }
    }
}
</script>
