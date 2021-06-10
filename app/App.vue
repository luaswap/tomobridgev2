<template>
    <div id="app">
        <b-navbar
            toggleable="lg"
            type="light"
            class="tomo-header">
            <section class="container container-tomochain">
                <b-navbar-brand to="/">
                    <b-img
                        src="/app/assets/images/logo-tomo-bridge.svg"
                        alt="TomoBridge"/>
                </b-navbar-brand>
                <!-- button menu SP -->
                <b-navbar-toggle
                    target="nav-collapse"
                    class="btn-menu-sp"/>
                <!-- /button menu SP -->
                <b-collapse
                    id="nav-collapse"
                    is-nav>
                    <div
                        class="ml-auto navbar-buttons d-none flex align-content-center">
                        <b-navbar-nav>
                            <b-nav-item-dropdown
                                v-if="address"
                                class="info-wallet btn-token-dropdown"
                                offset="25"
                                no-caret
                                right>
                                <template
                                    slot="button-content"
                                    class="tmp-btn-transparent">
                                    <i class="tb-wallet"/>
                                    {{ truncate(address, 16) }}
                                </template>
                                <b-dropdown-item
                                    class="flex_box">
                                    <span>Balance:</span>
                                    <strong>{{ balance }} {{ tomoIds.indexOf(network.chainId || '') > -1 ? 'TOMO' : 'ETH' }}</strong>
                                </b-dropdown-item>
                                <b-dropdown-item
                                    :href="scanUrl"
                                    class="flex_box"
                                    target="_blank">
                                    Transaction History
                                </b-dropdown-item>
                                <b-dropdown-divider/>
                                <b-dropdown-item
                                    v-if="!mobileCheck"
                                    class="sign_out"
                                    @click="signOut">
                                    Sign out
                                </b-dropdown-item>
                            </b-nav-item-dropdown>
                        </b-navbar-nav>
                        <div
                            v-if="address"
                            id="networkDiv"
                            class="btn-token network ml-3">{{ network.name }}</div>
                        <!-- <b-tooltip
                            v-if="address"
                            target="networkDiv">
                            <a
                                href="https://docs.tomochain.com/general/how-to-connect-to-tomochain-network/metamask"
                                target="_blank"><u>Switch Networks</u></a>
                            between Ethereum & TomoChain to wrap and unwrap tokens
                        </b-tooltip> -->
                        <b-dropdown
                            :text="selectedLanguage"
                            class="nav-item btn-language ml-2">
                            <b-dropdown-item
                                class="current-lang"
                                @click="changeLang('english')">English</b-dropdown-item>
                            <!-- <b-dropdown-item
                                @click="changeLang('turkish')">Türk</b-dropdown-item>
                            <b-dropdown-item
                                @click="changeLang('japanese')">日本語</b-dropdown-item>
                            <b-dropdown-item
                                @click="changeLang('chinese')">简体中文</b-dropdown-item> -->
                        </b-dropdown>
                    </div>
                    <b-nav
                        class="text-white ml-auto">
                        <b-nav-item active>Home</b-nav-item>
                        <b-nav-item>Instruction video</b-nav-item>
                        <b-nav-item>Support ticket</b-nav-item>
                        <b-nav-item>FAQ</b-nav-item>
                        <b-dropdown
                            :text="selectedLanguage"
                            class="nav-item btn-language ml-2">
                            <b-dropdown-item
                                class="current-lang"
                                @click="changeLang('english')">English</b-dropdown-item>
                            <!-- <b-dropdown-item
                                @click="changeLang('turkish')">Türk</b-dropdown-item>
                            <b-dropdown-item
                                @click="changeLang('japanese')">日本語</b-dropdown-item>
                            <b-dropdown-item
                                @click="changeLang('chinese')">简体中文</b-dropdown-item> -->
                        </b-dropdown>
                    </b-nav>
                </b-collapse>
            </section>
        </b-navbar>
        <div class="page-layout">
            <router-view/>
        </div>
        <LoginModal
            ref="loginModal"
            :parent="this"/>
        <ClaimModal
            ref="claimModal"
            :parent="this"/>
    </div>
</template>

<script>
import urljoin from 'url-join'
import Helper from './utils'
import LoginModal from './components/modals/Login.vue'
import ClaimModal from './components/modals/ClaimToken.vue'
export default {
    name: 'App',
    components: {
        LoginModal,
        ClaimModal
    },
    data () {
        return {
            selectedLanguage: this.$store.state.language || 'English',
            provider: '',
            isTomoChain: '',
            tomoIds: [88, 89, 99],
            config: {},
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
        mobileCheck () {
            if (window.web3 && window.web3.currentProvider &&
                window.web3.currentProvider.isTomoWallet) {
                return true
            } else return false
        }
    },
    watch: {
        network: async function (newVal, oldVal) {
            if (newVal.name !== oldVal.name) {
                if (this.address) {
                    this.getBalance(this.address).then(data => {
                        if (data) {
                            this.$store.state.balance = data.toFixed(5)
                        }
                    }).catch(error => console.log(error))
                }
            }
        },
        address: function (value) {
            this.scanUrl = urljoin(this.config.tomoscanUrl, 'address', value)
        }
    },
    async updated () {
        if (this.$store.state.address && this.$store.state.network) {
            if (window.ethereum) {
                window.ethereum.on('chainChanged', async (chainId) => {
                    this.$store.state.network = Helper.networks[parseInt(chainId, 16)] || { name: 'Unknown', chainId: 0 }
                })
            }
        }
    },
    destroyed () { },
    created: async function () {
        this.appConfig().then(data => {
            this.$store.state.config = data
            this.config = data
        }).catch(error => {
            this.$toasted.show(error.message ? error.message : error, { type: 'error' })
        })
    },
    methods: {
        openLoginModal () {
            this.$refs.loginModal.show()
        },
        openClaimTokenModal () {
            this.$refs.claimModal.show()
        },
        signOut () {
            this.$store.state.address = ''
            this.$store.state.network = ''
            if (this.$route.path !== '/select') {
                this.$router.push({
                    path: '/select'
                })
            }
        }
    }
}
</script>
