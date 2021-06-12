<template>
    <div
        class="">
        Transaction Details:
        <div>
            <div
                class="infor-wallet mb-4">
                <div class="connect">
                    <div class="box-address-wallet"><span class="tag">{{ network.name }}</span> <b>{{ address }}</b></div>
                    <div class="box-address-infor mt-3">
                        <span
                            class="text-gray">
                            Balance: {{ balance }} {{ tomoIds.indexOf(network.chainId || '') > -1 ? 'TOMO' : 'ETH' }}
                        </span>
                    </div>
                    <div>
                        Asset
                        <div>
                            <img
                                v-if="fromWrapSelected.image"
                                :src="fromWrapSelected.image"
                                class="multiselect__img">
                            {{ fromWrapSelected.symbol }}
                        </div>

                        Amount
                        <div>
                            {{ parent.depAmount || parent.amount }}
                        </div>

                        Recipient Address
                        <div>{{ parent.recAddress }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'App',
    components: {
    },
    props: {
        parent: {
            type: Object,
            default: () => {}
        }
    },
    data () {
        return {
            fromWrapSelected: this.parent.fromWrapSelected,
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
        }
    },
    async updated () {
    },
    destroyed () { },
    created: async function () {
    },
    methods: {
    }
}
</script>
