<template>
    <div
        class="row align-items-center infor-wallet mb-4">
        <div class="col-10 col-md-11 connect">
            <div class="box-address-wallet">
                <span class="tag">
                    <b>
                        {{ network.name }}
                    </b>
                </span>
                <span class="d-block d-md-inline-block mt-2 mt-md-0">
                    <b>
                        {{ mobileCheck ? truncate(address, 36) : address }}
                    </b>
                </span>
            </div>
            <div class="box-address-infor mt-3">
                <span
                    class="text-gray">
                    Balance: {{ balance }} {{ tomoIds.indexOf(network.chainId || '') > -1 ? 'TOMO' : 'ETH' }}
                </span>
                <a
                    :href="scanUrl"
                    target="_blank"
                    class="text-blue ml-3 ml-md-5">
                    Transaction history
                </a>
            </div>
        </div>
        <div class="col-2 col-md-1 btn-sign-out text-right pr-md-0">
            <span
                @click="signOut">
                <b-img
                    src="/app/assets/images/close.svg"
                    alt="TomoBridge"/></span>
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
