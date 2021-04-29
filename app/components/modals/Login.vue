<template>
    <b-modal
        id="loginModal"
        ref="loginModal"
        centered
        scrollable
        size="sm"
        hide-footer>
        <template #modal-title>
            <div class="">Connect to a wallet</div>
        </template>
        <b-container>
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
                <b-button
                    class="d-flex"
                    @click="loginPantograph">
                    <span>
                        Pantograph
                    </span>
                    <img
                        src="/app/assets/images/pantograph.png"
                        alt="Metamask">
                </b-button>
            </div>
        </b-container>
    </b-modal>
</template>

<script>
import Web3 from 'web3'
import Helper from '../../utils'
export default {
    name: 'App',
    components: { },
    mixins: [],
    props: {
        parent: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            ethIds: [1, 3, 4, 5],
            tomoIds: [88, 89, 99]
        }
    },
    validations: { },
    async updated () { },
    destroyed () { },
    created: async function () {
    },
    methods: {
        show () {
            this.$refs.loginModal.show()
        },
        hide () {},
        async loginMetamask () {
            try {
                if (window.ethereum) {
                    this.loading = true
                    const walletProvider = window.ethereum
                    const wjs = new Web3(walletProvider)

                    await this.setupProvider('metamask', wjs)
                    const data = await this.getChainId()
                    this.$store.state.network = Helper.networks[data] || { name: 'Unknown', chainId: 0 }
                    this.address = await this.getAccount()

                    this.getBalance(this.address).then(data => {
                        if (data) {
                            this.$store.state.balance = data.toFixed(5)
                        }
                    }).catch(error => console.log(error))

                    parent.address = this.address
                    this.$store.state.address = this.address
                    this.$store.state.provider = 'metamask'
                    this.loading = false

                    this.$refs.loginModal.hide()
                    if (this.$store.state.redirectTo) {
                        if (this.checkNetworkBeforeRedirect()) {
                            this.$router.push({ path: this.$store.state.redirectTo })
                        }
                    }
                }
            } catch (error) {
                this.loading = false
                console.log(error)
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        },
        async loginPantograph () {
            try {
                const parent = this.parent
                if (window.ethereum) {
                    this.loading = true
                    const walletProvider = window.ethereum
                    const wjs = new Web3(walletProvider)

                    await this.setupProvider('pantograph', wjs)
                    this.getChainId().then(data => {
                        this.$store.state.network = Helper.networks[data] || { name: 'Unknown', chainId: 0 }
                    }).catch(error => console.log(error))
                    this.address = await this.getAccount()

                    parent.address = this.address
                    this.$store.state.address = this.address
                    this.$store.state.provider = 'pantograph'
                    this.loading = false
                    this.$refs.loginModal.hide()
                    if (this.$store.state.redirectTo) {
                        if (this.checkNetworkBeforeRedirect()) {
                            this.$router.push({ path: this.$store.state.redirectTo })
                        }
                    }
                }
            } catch (error) {
                this.loading = false
                console.log(error)
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        },
        checkNetworkBeforeRedirect () {
            const network = this.$store.state.network
            if (this.tomoIds.indexOf(network.chainId) > -1) {
                if (this.$store.state.redirectTo === 'unwrap') {
                    return true
                }
                this.$toasted.show('Need TomoChain network to unwrap', { type: 'error' })
                return false
            }
            if (this.ethIds.indexOf(network.chainId) > -1) {
                if (this.$store.state.redirectTo === 'wrap') {
                    return true
                }
                this.$toasted.show('Need Ethereum network to wrap', { type: 'error' })
                return false
            }
        }
    }
}
</script>
