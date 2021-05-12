<template>
    <div id="app">
        <b-navbar
            v-if="$route.path !== '/'"
            toggleable="lg"
            type="light"
            class="tomo-header"
            variant="dark">
            <section class="container container-tomochain">
                <b-navbar-brand to="/">
                    <b-img
                        src="/app/assets/images/logo3.svg"
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
                    <div class="ml-auto navbar-buttons d-flex align-content-center">
                        <b-button
                            v-if="!address"
                            class="btn-token"
                            @click="openLoginModal">Connect Wallets</b-button>
                        <b-navbar-nav>
                            <b-nav-item-dropdown
                                v-if="address"
                                class="info-wallet"
                                offset="25"
                                no-caret
                                right>
                                <template
                                    slot="button-content"
                                    class="tmp-btn-transparent">
                                    <i class="tm-icon-wallet"/>
                                    {{ truncate(address, 16) }}
                                </template>
                                <b-dropdown-item
                                    class="flex_box">
                                    <span>Balance:</span>
                                    <strong>{{ balance }} {{ tomoIds.indexOf(network.chainId || '') > -1 ? 'TOMO' : 'ETH' }}</strong>
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
                        <b-tooltip
                            v-if="address"
                            target="networkDiv">
                            <a
                                href="https://docs.tomochain.com/general/how-to-connect-to-tomochain-network/metamask"
                                target="_blank"><u>Switch Networks</u></a>
                            between Ethereum & TomoChain to wrap and unwrap tokens
                        </b-tooltip>
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
                </b-collapse>
            </section>
        </b-navbar>
        <div
            :class="`page-layout ${$route.path !== '/' ? 'common-main-content' : ''}`">
            <router-view/>
        </div>
        <footer
            class="tomo-footer footer">
            <div
                class="container ">
                <div class="tomo-meta-links text-center">
                    <div class="row">
                        <ul class="">
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
        </footer>
        <LoginModal
            ref="loginModal"
            :parent="this"/>
    </div>
</template>

<script>
import Helper from './utils'
import LoginModal from './components/modals/Login'
export default {
    name: 'App',
    components: {
        LoginModal
    },
    data () {
        return {
            selectedLanguage: this.$store.state.language || 'English',
            provider: '',
            isTomoChain: '',
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
        }
    },
    async updated () {
        if (this.$store.state.address && this.$store.state.network) {
            if (window.ethereum) {
                window.ethereum.on('chainChanged', async (chainId) => {
                    this.$store.state.network = Helper.networks[parseInt(chainId, 16)] || { name: 'Unknown', chainId: 0 }
                    this.balance = (await this.getBalance(this.address)).toFixed(5)
                    this.web3.eth.getId().then(data => console.log(data))
                    // const walletProvider = window.ethereum
                    // const wjs = new Web3(walletProvider)

                    // await this.setupProvider('pantograph', wjs)
                    // this.setupProvider()
                })
                // window.ethereum.on('accountsChanged', async (accounts) => {
                //     console.log(accounts)
                //     await this.getAccount()
                //     console.log('address', this.address)
                //     this.$store.state.address = accounts[0]
                //     // console.log(this.address)
                //     this.balance = (await this.getBalance(accounts[0]) || 0).toFixed(5)
                // })
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
