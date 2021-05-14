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
                                <span class="multiselect__name">{{ props.option.name }}</span>
                                <i
                                    v-if="(verifiedList.indexOf((props.option.wrapperAddress || '').toLowerCase()) > 0)
                                        || props.option.name === 'BTC' || props.option.name === 'ETH'"
                                    class="tb-check-circle-o multiselect_greentick"/>
                            </div>
                            <div
                                v-if="tokenBalanceToFixed > 0"
                                class="mr-3">({{ tokenBalanceToFixed }})</div>
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
            <p class="font-weight-bold">You are converting TomoChain wrapped {{ fromWrapSelected.symbol }} to ERC-20 {{ fromWrapSelected.symbol }}</p>
        </div>
        <b-row>
            <b-col cols="6">
                <ul class="st-ul">
                    <li
                        v-if="fromWrapSelected.symbol !== 'BTC' && fromWrapSelected.symbol !== 'ETH'">
                        View Wrapped Token address on
                        <a
                            :href="etherScanUrl"
                            target="_blank">Etherscan</a>
                    </li>
                    <li>
                        <span class="font-weight-bold">Estimated conversion transaction fee</span>
                        <div class="d-flex flex-column mt-4">
                            <!-- <div v-if="!isApproved">Approve: 1 TOMO</div> -->
                            <div>
                                Swap: {{ fee }} Wrapped {{ tomoFeeMode ? 'TOMO' : fromWrapSelected.symbol }}
                            </div>
                            <div class="text-danger font-weight-bold">
                                Total: {{ fee }} Wrapped {{ tomoFeeMode ? 'TOMO' : fromWrapSelected.symbol }}
                            </div>
                        </div>
                    </li>
                </ul>
            </b-col>
            <b-col cols="6">
                <b-form-group
                    class="mb-4 font-weight-bold"
                    label="Amount"
                    label-for="amount">
                    <b-form-input
                        v-model="amount"
                        :placeholder="fromWrapSelected.minimumWithdrawal ?
                            `Deposit amount(Min: ${fromWrapSelected.minimumWithdrawal} ${fromWrapSelected.symbol})` : 'Deposit amount'"
                        type="text"/>
                    <b-button
                        class="token-max"
                        variant="success"
                        @click="maxToken">
                        Max
                    </b-button>
                </b-form-group>
                <b-form-group
                    class="mb-4 font-weight-bold"
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
                    font-scale="2"/>
                Back
            </b-button>
            <b-button
                class="btn--big st-next"
                @click="unwrapToken">
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
import WAValidator from 'wallet-address-validator'
export default {
    name: 'App',
    components: {
        Multiselect
    },
    data () {
        return {
            verifiedList: [],
            amount: '',
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
            etherScanUrl: '',
            tokenBalanceToFixed: 0,
            tokenBalance: '',
            isAddress: true,
            tomoFeeMode: false,
            fee: 0,
            contract: '',
            contractAddress: '',
            isNativeToken: false
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
            this.fromData = this.config.swapCoin || []
            this.fromWrapSelected = this.fromData[0]

            this.etherScanUrl = urljoin(
                this.fromWrapSelected.explorerUrl,
                'token',
                this.fromWrapSelected.tokenAddress
            )

            const { contract, contractAddress } = await this.getContract()
            this.contract = contract
            this.contractAddress = contractAddress
            this.getTokenBalance(this.fromWrapSelected)
            this.contract.methods.TOMO_FEE_MODE.call()
                .then(data => {
                    this.tomoFeeMode = data
                    this.getWithdrawFee()
                }).catch(error => {
                    this.$toasted.show(error, { type: 'error' })
                })
        }
    },
    methods: {
        customLabel ({ name }) {
            return `${name}`
        },
        back () {
            this.$router.go(-1)
        },
        useAddress () {
            this.recAddress = this.address
        },
        maxToken () {
            const token = this.fromWrapSelected
            this.amount = new BigNumber(this.tokenBalance).div(10 ** token.decimals).toString()
        },
        async selectToken (token) {
            this.fromWrapSelected = token
            this.etherScanUrl = urljoin(
                token.explorerUrl,
                'token',
                token.tokenAddress
            )
            await this.getContract(token)
            this.getTokenBalance(token)
            this.tomoFeeMode = await this.contract.methods.TOMO_FEE_MODE.call()
            await this.getWithdrawFee(token)
        },
        getContract (token = this.fromWrapSelected) {
            this.contract = new this.web3.eth.Contract(
                // this.WrapperAbi.abi,
                this.TomoBridgeTokenAbi.abi,
                token.wrapperAddress.toLowerCase()
            )
            return { contract: this.contract, contractAddress: token.wrapperAddress }
        },
        async getTokenBalance (token) {
            const contract = new this.web3.eth.Contract(
                this.TomoBridgeTokenAbi.abi,
                token.wrapperAddress
            )
            const balanceBN = await contract.methods.balanceOf(this.address).call()
            this.tokenBalance = balanceBN
            this.tokenBalanceToFixed = new BigNumber(balanceBN).div(10 ** token.decimals).toFixed(5)
        },
        async getWithdrawFee (token = this.fromWrapSelected) {
            let feeBN
            if (this.tomoFeeMode) {
                feeBN = await this.contract.methods.WITHDRAW_FEE_TOMO().call()
                this.fee = new BigNumber(feeBN).div(10 ** 18).toString(10)
            } else {
                feeBN = await this.contract.methods.WITHDRAW_FEE().call()
                this.fee = new BigNumber(feeBN).div(10 ** token.decimals).toString(10)
            }
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
        checkMinimumWithdrawAmount () {
            const coin = this.fromWrapSelected
            if (new BigNumber(this.amount || 0).isLessThan(new BigNumber(coin.minimumWithdrawal))) {
                return false
            }
            return true
        },
        unwrapToken () {
            const coin = this.fromWrapSelected
            this.isAddress = this.isValidAddresss()
            if (this.isAddress) {
                if (!this.agreeAll || !this.agreeEx || !this.agreePk) {
                    this.$toasted.show('Confirmation required', { type: 'error' })
                    // this.allChecked = true
                } else if (!this.checkMinimumWithdrawAmount()) {
                    this.$toasted.show(`Minimum Withdrawal is ${coin.minimumWithdrawal} ${coin.symbol}`)
                } else if (new BigNumber(this.amount).isLessThan(this.fee)) {
                    this.$toasted.show('Withdraw amount must be greater than withdraw fee', { type: 'error' })
                } else {
                    this.$router.push({
                        name: 'UnwrapExecution',
                        params: {
                            recAddress: this.recAddress,
                            amount: this.amount,
                            fromWrapSelected: this.fromWrapSelected
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
