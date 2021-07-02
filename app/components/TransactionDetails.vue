<template>
    <div
        class="">
        <p>Transaction Details:</p>
        <div
            class="box-more-infor mb-4">
            <div class="infor-address-wallet">
                <p class="mb-1 mb-md-2">
                    <span class="tag">{{ network.name }}</span>
                    <span class="text-gray mt-2 d-block d-md-inline-block">{{ mobileCheck ? truncate(address, 30) : address }}</span></p>
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
                        class="mb-4 font-weight-bold overflow-hidden"
                        label="Amount">
                        <div class="bg_input_tags font-weight-normal">
                            {{ parent.depAmount || parent.amount }}
                        </div>
                    </b-form-group>

                </b-col>
                <b-col cols="12">
                    <b-form-group
                        class="font-weight-bold overflow-hidden"
                        label="Receiving Address">
                        <div class="bg_input_tags font-weight-normal">
                            {{ mobileCheck ? truncate(parent.recAddress, 30) : parent.recAddress }}
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
