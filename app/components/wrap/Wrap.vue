<template>
    <b-container>
        <h5 class="">Select Asset to convert</h5>
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
                    track-by="symbol"
                    @select="selectToken">
                    <template
                        slot="singleLabel"
                        slot-scope="props">
                        <div class="d-flex justify-content-between">
                            <div>
                                <img
                                    v-if="props.option.image"
                                    :src="props.option.image"
                                    class="multiselect__img">
                                <span class="multiselect__name">{{ props.option.symbol }}</span>
                                <i
                                    v-if="(verifiedList.indexOf((props.option.wrapperAddress || '').toLowerCase()) > 0)
                                        || props.option.symbol === 'BTC' || props.option.symbol === 'ETH'"
                                    class="tb-check-circle-o multiselect_greentick"/>
                            </div>
                            <div
                                v-if="tokenBalanceToFixed > 0"
                                class="text-right mr-3">({{ tokenBalanceToFixed }})</div>
                        </div>
                    </template>
                    <template
                        slot="option"
                        slot-scope="props">
                        <img
                            v-if="props.option.image"
                            :src="props.option.image"
                            class="multiselect__img">
                        <span class="multiselect__name">{{ props.option.symbol }}</span>
                        <i
                            v-if="(verifiedList.indexOf((props.option.wrapperAddress || '').toLowerCase()) > 0)
                                || props.option.symbol === 'BTC' || props.option.symbol === 'ETH'"
                            class="tb-check-circle-o multiselect_greentick"/>
                    </template>
                </multiselect>
            </b-col>
        </b-row>

        <div class="text-center my-5">
            <p>You are converting {{ fromWrapSelected.symbol !== 'ETH' && fromWrapSelected.symbol !== 'BTC' ? 'ERC-20' : '' }}
                {{ fromWrapSelected.symbol }} to TomoChain wrapped {{ fromWrapSelected.symbol }}</p>
        </div>
        <b-row>
            <b-col cols="6">
                <ul class="st-ul">
                    <li>
                        View Wrapped Token address on
                        <a
                            :href="tomoScanUrl"
                            target="_blank">TomoScan</a>
                    </li>
                    <li>
                        <span class="font-weight-bold">Estimated conversion transaction fee</span>
                        <div class="d-flex flex-column mt-4">
                            <div v-if="!isApproved">Approve: 1 ETH</div>
                            <div>Swap: 1 ETH</div>
                            <div class="text-danger font-weight-bold">Total: 1 ETH</div>
                        </div>
                    </li>
                </ul>
            </b-col>
            <b-col cols="6">
                <b-form-group
                    class="mb-4"
                    label="Amount"
                    label-for="depAmount">
                    <b-form-input
                        v-model="depAmount"
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
                    label-for="recAddress">
                    <b-form-input
                        v-model="recAddress"
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
                    font-scale="1.5"/>
                Back
            </b-button>
            <b-button
                class="btn--big st-next"
                @click="wrapToken">
                Next
                <b-icon
                    class="light-h"
                    icon="arrow-right-short"
                    font-scale="1.5"/>
            </b-button>
        </div>
    </b-container>
</template>

<script>
import BigNumber from 'bignumber.js'
import Multiselect from 'vue-multiselect'
import urljoin from 'url-join'
import WAValidator from 'wallet-address-validator'
export default {
    name: 'App',
    components: {
        Multiselect
    },
    data () {
        return {
            verifiedList: [],
            depAmount: '',
            isApproved: false,
            agreeEx: false,
            agreePk: false,
            agreeAll: false,
            allChecked: false,
            fromWrapSelected: {},
            recAddress: '',
            fromData: [
                { name: 'Ethereum', symbol: 'ETH', image: '' }
            ],
            config: this.$store.state.config,
            tokenBalanceToFixed: 0,
            tokenBalance: '',
            tomoScanUrl: '',
            minimumDeposit: 0
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
    },
    destroyed () { },
    created: async function () {
        this.$store.state.redirectTo = ''
        if (!this.$store.state.address) {
            this.$router.push({
                path: '/select'
            })
        } else {
            const config = this.config
            this.fromData = this.config.swapCoin || []
            this.fromWrapSelected = this.fromData[0]

            this.minimumDeposit = this.fromWrapSelected.minimumWithdrawal

            this.tomoScanUrl = urljoin(
                config.tomoscanUrl,
                'tokens',
                this.fromWrapSelected.wrapperAddress
            )
            this.getTokenBalance(this.fromWrapSelected)
        }
    },
    methods: {
        customLabel ({ symbol }) {
            return `${symbol}`
        },
        back () {
            this.$router.go(-1)
        },
        useAddress () {
            this.recAddress = this.address
        },
        async maxToken () {
            const token = this.fromWrapSelected
            switch (token.symbol) {
            case 'ETH':
                const balanceEthBN = await this.ethWeb3.eth.getBalance(this.address)
                this.depAmount = new BigNumber(balanceEthBN).div(10 ** 18).toString(10)
                break
            case 'BTC':
                this.depAmount = 0
                break
            default:
                this.depAmount = new BigNumber(this.tokenBalance).div(10 ** this.fromWrapSelected.decimals).toString(10)
                break
            }
        },
        async getTokenBalance (token) {
            switch (token.symbol) {
            case 'ETH':
                this.tokenBalanceToFixed = this.$store.state.balance
                break
            case 'BTC':
                this.tokenBalanceToFixed = 0
                break
            default:
                const contract = new this.ethWeb3.eth.Contract(
                    this.ERC20Abi.abi,
                    token.tokenAddress
                )
                const tokenDecimals = await contract.methods.decimals().call()
                let balanceBN = await contract.methods.balanceOf(this.address).call()
                this.tokenBalance = balanceBN
                this.tokenBalanceToFixed = new BigNumber(balanceBN).div(10 ** tokenDecimals).toFixed(5)
                break
            }
        },
        checkminimumDeposit () {
            if (
                new BigNumber(this.depAmount || 0).isLessThan(this.minimumDeposit)
            ) {
                return false
            } else { return true }
        },
        async selectToken (token) {
            const config = this.config
            this.tomoScanUrl = urljoin(
                config.tomoscanUrl,
                'tokens',
                token.wrapperAddress
            )
            this.getTokenBalance(token)
        },
        isValidAddresss () {
            const address = this.recAddress
            const config = this.config
            // Check network
            const network = config.blockchain.networkId === 88 ? 'prod' : 'testnet'
            switch (this.fromWrapSelected.network.toLowerCase()) {
            case 'bitcoin':
                return WAValidator.validate(address, 'BTC', network)
            case 'ethereum':
                return this.web3.utils.isAddress(address)
            default:
                return false
            }
        },
        wrapToken () {
            const coin = this.fromWrapSelected
            this.isAddress = this.isValidAddresss()
            if (this.isAddress) {
                if (!this.agreeAll || !this.agreeEx || !this.agreePk) {
                    this.$toasted.show('Confirmation required', { type: 'error' })
                    // this.allChecked = true
                } else if (!this.checkminimumDeposit()) {
                    this.$toasted.show(`Minimum deposit is ${coin.minimumWithdrawal} ${coin.symbol}`)
                } else {
                    this.$router.push({
                        name: 'WrapExecution',
                        params: {
                            receiveAddress: this.recAddress,
                            fromWrapToken: this.fromWrapSelected,
                            depAmount: this.depAmount
                        }
                    })
                }
            } else {
                this.$toasted.show('Invalid recipient address', { type: 'error' })
            }
        }
    }
}
</script>
