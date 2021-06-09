<template>
    <b-container>
        <div
            v-if="!address"
            class="login-wallet">
            <div
                class="connect p-3 px-lg-4 pb-lg-4 pt-lg-5">
                <div
                    id="login"
                    class="pb-4">
                    <h4
                        class="h4 text-center">Connect Wallet</h4>
                    <div
                        class="login__buttons mt-3">
                        <b-button
                            class="d-flex"
                            @click="loginMetamask">
                            <span>
                                Metamask
                            </span>
                            <img
                                src="/app/assets/images/metamask.png"
                                alt="Metamask">
                        </b-button>
                    </div>
                </div>
                <b-alert
                    class="mb-0 font-smaller"
                    show
                    variant="success">
                    Swapping <b>TOMO</b> to <b>TOMOE</b> requires the Metamask network to be set to TomoChain.
                    Likewise swapping <b>TOMOE</b> to <b>TOMO</b> requires the Metamask network to be set to Ethereum. Follow
                    <b-link
                        href="https://docs.tomochain.com/general/how-to-connect-to-tomochain-network/metamask"
                        target="_blank">
                        this guide
                    </b-link>
                    to learn more.
                </b-alert>
            </div>
        </div>
        <b-row
            v-else
            align-h="center">
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
                                <span>ERC-20 Tokens on Ethereum</span>
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
import LoginModal from './components/modals/Login'
import ClaimTokenModal from './components/modals/ClaimToken'
export default {
    name: 'App',
    components: {
        LoginModal,
        ClaimTokenModal
    },
    data () {
        return {
            ethIds: [1, 3, 4, 5],
            tomoIds: [88, 89, 99],
            loading: false
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
        if (this.address) {
            const data1 = await this.checkUnclaimTx()
            if (data1) {
                this.$store.state.unClaimTx = data1
                this.$refs.claimModal.show()
            }
        }
    },
    methods: {
        openClaimTokenModal () {
            this.$refs.claimTokenModal.show()
        },
        redirect (product) {
            console.log(this.$store.state.network)
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
                        this.$bus.$emit('reclaim')
                        this.$refs.claimModal.show()
                    } else {
                        this.loading = false
                    }
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
