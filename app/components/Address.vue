<template>
    <div
        class="infor-wallet mb-4">
        <div class="connect">
            <div class="box-address-wallet"><span class="tag">{{ network.name }}</span> <b>{{ address }}</b></div>
            <div class="box-address-infor mt-3">
                <span
                    class="text-gray">
                    Balance: {{ balance }} {{ tomoIds.indexOf(network.chainId || '') > -1 ? 'TOMO' : 'ETH' }}
                </span>
                <a
                    :href="scanUrl"
                    target="_blank"
                    class="text-blue">
                    Transaction history
                </a>
            </div>
        </div>
        <div class="btn-sign-out">
            <span
                @click="signOut">Sign out</span>
        </div>
    </div>
</template>
<script>
import urljoin from 'url-join'
export default {
    name: 'App',
    components: {
    },
    data () {
        return {
            provider: '',
            tomoIds: [88, 89, 99],
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
    },
    destroyed () { },
    created: async function () {
        if (this.address) {
            this.scanUrl = urljoin(this.config.tomoscanUrl, 'address', this.address)
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
        }
    }
}
</script>
