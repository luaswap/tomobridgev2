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
                    class="sp-navbar-bridge"
                    is-nav>
                    <b-navbar-nav
                        class="text-white ml-auto">
                        <!-- <b-nav-item class="position-relative">Instruction video <span class="coming-soon">Coming soon</span></b-nav-item> -->
                        <b-nav-item-dropdown
                            class="nav-item btn-language ml-2"
                            no-caret
                            text="Instruction video">
                            <!-- eslint-disable -->
                            <b-dropdown-item
                                href="https://www.youtube.com/watch?v=O2QDRsfE2sc"
                                target="_blank">TOMO <> TOMOE</b-dropdown-item>
                            <!-- eslint-enable -->
                            <b-dropdown-item
                                href="https://www.youtube.com/watch?v=BMea900EY2Y"
                                target="_blank">Wrap (Ethereum > TomoChain)</b-dropdown-item>
                            <b-dropdown-item
                                href="https://www.youtube.com/watch?v=1dVwU2Wu5ao"
                                target="_blank">Unwrap (TomoChain > Ethereum)</b-dropdown-item>
                        </b-nav-item-dropdown>
                        <b-nav-item
                            href="https://forms.gle/cU1XU3b8EUMxB6yA6"
                            target="_blank">Support ticket</b-nav-item>
                        <b-nav-item
                            href="https://docs.tomochain.com/tomobridge/faq"
                            target="_blank">FAQ</b-nav-item>
                        <b-nav-item
                            v-if="mobileCheck"
                            to="/claimonbehalf">Claim token with multicoin wallet</b-nav-item>
                        <!-- <b-dropdown
                            :text="selectedLanguage"
                            class="nav-item btn-language ml-2">
                            <b-dropdown-item
                                class="current-lang"
                                @click="changeLang('english')">English</b-dropdown-item>
                            <b-dropdown-item
                                @click="changeLang('turkish')">Türk</b-dropdown-item>
                            <b-dropdown-item
                                @click="changeLang('japanese')">日本語</b-dropdown-item>
                            <b-dropdown-item
                                @click="changeLang('chinese')">简体中文</b-dropdown-item>
                        </b-dropdown> -->
                    </b-navbar-nav>
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
        mobileCheck: () => {
            const isAndroid = navigator.userAgent.match(/Android/i)
            const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i)
            return (isAndroid || isIOS)
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
    },
    destroyed () { },
    created: async function () {
        this.appConfig().then(data => {
            this.$store.state.config = data
            this.config = data
        }).catch(error => {
            this.$toasted.show(error.message ? error.message : error, { type: 'error' })
        })
        if (window.ethereum) {
            window.ethereum.on('chainChanged', async (chainId) => {
                this.$store.state.network = Helper.networks[parseInt(chainId, 16)] || { name: 'Unknown', chainId: 0 }
            })
        }
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
