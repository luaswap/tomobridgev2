<template>
    <b-container>
        <h4 class="">Select Asset to convert</h4>
        <b-row class="wrapbox__row mb-lg-4 mt-4">
            <b-col cols="7">
                <multiselect
                    id="fromwrap-select"
                    v-model="fromWrapSelected"
                    :options="fromData"
                    :custom-label="customLabel"
                    :show-labels="false"
                    :allow-empty="false"
                    :close-on-select="true"
                    track-by="name"
                    @select="getTokenBalance">
                    <template
                        slot="singleLabel"
                        slot-scope="props">
                        <div class="d-flex justify-content-between">
                            <div>
                                <img
                                    v-if="props.option.image"
                                    :src="props.option.image"
                                    class="multiselect__img">
                                <span class="multiselect__name">{{ props.option.name }}</span>
                                <i
                                    v-if="(verifiedList.indexOf((props.option.wrapperAddress || '').toLowerCase()) > 0)
                                        || props.option.name === 'BTC' || props.option.name === 'ETH'"
                                    class="tb-check-circle-o multiselect_greentick"/>
                            </div>
                            <div
                                v-if="tokenBalanceToFixed > 0"
                                class="">({{ tokenBalanceToFixed }})</div>
                        </div>
                    </template>
                    <template
                        slot="option"
                        slot-scope="props">
                        <img
                            v-if="props.option.image"
                            :src="props.option.image"
                            class="multiselect__img">
                        <span class="multiselect__name">{{ props.option.name }}</span>
                        <i
                            v-if="(verifiedList.indexOf((props.option.wrapperAddress || '').toLowerCase()) > 0)
                                || props.option.name === 'BTC' || props.option.name === 'ETH'"
                            class="tb-check-circle-o multiselect_greentick"/>
                    </template>
                </multiselect>
            </b-col>
        </b-row>

        <div class="text-center my-5">
            <p>You are converting TomoChain wrapped {{ fromWrapSelected.symbol }} to ERC-20 {{ fromWrapSelected.symbol }}</p>
        </div>
        <b-row>
            <b-col cols="6">
                <ul class="st-ul">
                    <li
                        v-if="fromWrapSelected.symbol !== 'BTC' || fromWrapSelected.symbol !== 'ETH'">
                        View Wrapped Token address on
                        <a
                            :href="etherScanUrl"
                            target="_blank">Etherscan</a>
                    </li>
                    <li>
                        <span class="font-weight-bold">Estimated conversion transaction fee</span>
                        <div class="d-flex flex-column mt-4">
                            <div v-if="!isApproved">Approve: 1 TOMO</div>
                            <div>Swap: 1 TOMO</div>
                            <div class="text-danger font-weight-bold">Total: 1 TOMO</div>
                        </div>
                    </li>
                </ul>
            </b-col>
            <b-col cols="6">
                <b-form-group
                    class="mb-4"
                    label="Amount"
                    label-for="withdrawAmount">
                    <b-form-input
                        v-model="withdrawAmount"
                        type="text"
                        placeholder="Deposit amount"/>
                    <b-button
                        class="token-max"
                        variant="success"
                        @click="maxToken">
                        Max
                    </b-button>
                </b-form-group>
                <b-form-group
                    class="mb-4"
                    label="Recipient Address"
                    label-for="withdrawAddress">
                    <b-form-input
                        v-model="withdrawAddress"
                        type="text"
                        placeholder="Please use only TomoChain network address"/>
                    <b-button
                        class="add-address"
                        variant="success"
                        @click="useAddress">
                        Address
                    </b-button>
                </b-form-group>
            </b-col>
        </b-row>
        <div class="mt-3 style-label">
            <p class="font-weight-bold mb-2">Please confirm the following:</p>
            <b-form-checkbox
                v-model="agreeEx"
                class="mr-1 m1 light-h">
                My recipient address has NOT been created on a centralized exchange (e.g binance.com)
            </b-form-checkbox>
            <b-form-checkbox
                v-model="agreePk"
                class="mr-1 m1 light-h">
                I have a Private Key/Mnemonic Phrase of the TOMO receiving address I entered above
            </b-form-checkbox>
            <b-form-checkbox
                v-model="agreeAll"
                class="mr-1 m1 light-h">
                I have double checked that my recipient address is correct
            </b-form-checkbox>
            <div
                v-if="allChecked"
                class="text-error">
                <b-icon
                    class="mr-1 m1 light-h"
                    icon="exclamation-circle"
                    font-scale="1"/>
                Required fields
            </div>
        </div>
        <div class="step-one__buttons text-center mt-5">
            <b-button
                class="btn--big st-back"
                @click="back">
                <b-icon
                    class="light-h"
                    icon="arrow-left-short"
                    font-scale="2"/>
                Back
            </b-button>
            <b-button
                class="btn--big st-next">
                Next
                <b-icon
                    class="light-h"
                    icon="arrow-right-short"
                    font-scale="2"/>
            </b-button>
        </div>
    </b-container>
</template>

<script>
import urljoin from 'url-join'
import BigNumber from 'bignumber.js'
import Multiselect from 'vue-multiselect'
export default {
    name: 'App',
    components: {
        Multiselect
    },
    data () {
        return {
            verifiedList: [],
            withdrawAmount: '',
            isApproved: false,
            agreeEx: false,
            agreePk: false,
            agreeAll: false,
            allChecked: false,
            fromWrapSelected: {},
            withdrawAddress: '',
            fromData: [
                { name: 'Ethereum', symbol: 'ETH', image: '' }
            ],
            config: this.$store.state.config,
            etherScanUrl: '',
            tokenBalanceToFixed: 0,
            tokenBalance: ''
        }
    },
    computed: {
        address: {
            get () {
                return this.$store.getters.address
            },
            set () {}
        }
    },
    async updated () {
        this.etherScanUrl = urljoin(
            this.fromWrapSelected.explorerUrl,
            'token',
            this.fromWrapSelected.tokenAddress
        )
    },
    destroyed () { },
    created: async function () {
        this.$store.state.redirectTo = ''
        if (!this.$store.state.address) {
            this.$router.push({
                path: '/select'
            })
        }
        this.fromData = this.config.swapCoin || []
        this.fromWrapSelected = this.fromData[0]
        this.getTokenBalance(this.fromWrapSelected)
    },
    methods: {
        customLabel ({ name }) {
            return `${name}`
        },
        back () {
            this.$router.go(-1)
        },
        useAddress () {
            this.withdrawAddress = this.address
        },
        maxToken () {
            const token = this.fromWrapSelected
            this.withdrawAmount = new BigNumber(this.tokenBalance).div(10 ** token.decimals).toString()
        },
        async getTokenBalance (token) {
            const contract = new this.web3.eth.Contract(
                this.TomoBridgeTokenAbi.abi,
                token.wrapperAddress
            )
            const balanceBN = await contract.methods.balanceOf(this.address).call()
            this.tokenBalance = balanceBN
            this.tokenBalanceToFixed = new BigNumber(balanceBN).div(10 ** token.decimals).toFixed(5)
        }
    }
}
</script>
