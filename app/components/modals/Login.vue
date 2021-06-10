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
                <!-- <b-button
                    class="d-flex"
                    @click="loginPantograph">
                    <span>
                        Pantograph
                    </span>
                    <img
                        src="/app/assets/images/pantograph.png"
                        alt="Metamask">
                </b-button> -->
            </div>
        </b-container>
        <ClaimTokenModal
            ref="claimTokenModal"
            :parent="this"/>
        <div
            :class="(loading ? 'tomo-loading' : '')"/>
    </b-modal>
</template>

<script>
import Web3 from 'web3'
import Helper from '../../utils'
import axios from 'axios'
import ClaimTokenModal from './ClaimToken'
export default {
    name: 'App',
    components: {
        ClaimTokenModal
    },
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
            tomoIds: [88, 89, 99],
            loading: false
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
            const parent = this.parent
            try {
                this.loading = true
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

                    // const data1 = await this.checkUnclaimTx()
                    let data1
                    if (data1) {
                        this.$store.state.unClaimTx = data1
                        this.loading = false
                        this.$refs.loginModal.hide()
                        this.$bus.$emit('reclaim')
                        parent.$refs.claimModal.show()
                    } else {
                        this.loading = false
                        this.$refs.loginModal.hide()
                        if (this.$store.state.redirectTo) {
                            if (this.checkNetworkBeforeRedirect()) {
                                this.$router.push({ path: this.$store.state.redirectTo })
                            }
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
            const redirectTo = this.$store.state.redirectTo
            const network = this.$store.state.network
            switch (redirectTo) {
            case 'unwrap':
                if (this.tomoIds.indexOf(network.chainId) > -1) {
                    this.$router.push({ path: redirectTo })
                } else {
                    this.$toasted.show('Need TomoChain network to unwrap', { type: 'error' })
                }
                break
            case 'wrap':
                if (this.ethIds.indexOf(network.chainId) > -1) {
                    this.$router.push({ path: redirectTo })
                } else {
                    this.$toasted.show('Need Ethereum network to wrap', { type: 'error' })
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
        }
    }
}
</script>
