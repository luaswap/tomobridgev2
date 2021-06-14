<template>
    <div
        class="">
        <p>Transaction Details:</p>
        <div
            class="box-more-infor mb-4">
            <div class="infor-address-wallet">
                <p><span class="tag">{{ network.name }}</span> <span class="text-gray">{{ address }}</span></p>
                <p class="text-gray">
                    Balance: {{ balance }} {{ tomoIds.indexOf(network.chainId || '') > -1 ? 'TOMO' : 'ETH' }}
                </p>
            </div>
            <hr>
            <b-row class="mt-4">
                <b-col cols="7">
                    <b-form-group
                        class="mb-4 font-weight-bold"
                        label="Asset">
                        <div class="bg_input_tags">
                            <img
                                v-if="fromWrapSelected.image"
                                :src="fromWrapSelected.image"
                                class="multiselect__img">
                            {{ fromWrapSelected.symbol }}
                        </div>

                    </b-form-group>
                </b-col>
                <b-col cols="5">
                    <b-form-group
                        class="mb-4 font-weight-bold"
                        label="Amount">
                        <div class="bg_input_tags font-weight-normal">
                            {{ parent.depAmount || parent.amount }}
                        </div>
                    </b-form-group>

                </b-col>
                <b-col cols="12">
                    <b-form-group
                        class="font-weight-bold"
                        label="Receiving Address">
                        <div class="bg_input_tags font-weight-normal">
                            {{ parent.recAddress }}
                        </div>
                    </b-form-group>

                </b-col>
            </b-row>
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
