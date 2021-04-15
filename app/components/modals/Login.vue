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
                const parent = this.parent
                if (window.ethereum) {
                    this.loading = true
                    const walletProvider = window.ethereum
                    const wjs = new Web3(walletProvider)

                    await this.setupProvider('metamask', wjs)
                    this.getChainId().then(data => {
                        this.$store.state.network = Helper.networks[data] || 'Unknown'
                    })
                    this.address = await this.getAccount()

                    parent.address = this.address
                    this.$store.state.address = this.address
                    this.$store.state.provider = 'metamask'
                    this.loading = false
                    this.$refs.loginModal.hide()
                }
            } catch (error) {
                this.loading = false
                console.log(error)
                this.$toasted.show(error, { type: 'erroor' })
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
                    this.address = await this.getAccount()

                    parent.address = this.address
                    this.$store.state.address = this.address
                    this.$store.state.provider = 'pantograph'
                    this.loading = false
                    this.$refs.loginModal.hide()
                }
            } catch (error) {
                this.loading = false
                console.log(error)
                this.$toasted.show(error, { type: 'erroor' })
            }
        }
    }
}
</script>
