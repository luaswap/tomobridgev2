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
                    @input="selectToken">
                    <template
                        slot="singleLabel"
                        slot-scope="props">
                        <div class="d-flex justify-content-between align-items-center">
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
                                class="text-right mr-4">{{ tokenBalanceToFixed }}</div>
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
            <p class="font-weight-bold">
                You are converting {{ fromWrapSelected.symbol !== 'ETH' && fromWrapSelected.symbol !== 'BTC' ? 'ERC-20' : '' }}
                {{ fromWrapSelected.symbol }} to TomoChain wrapped {{ fromWrapSelected.symbol }}</p>
        </div>
        <b-row>
            <b-col cols="6">
                <ul class="st-ul">
                    <li>
                        <div class="li-span">
                            View Wrapped Token address on
                            <a
                                :href="tomoScanUrl"
                                target="_blank">TomoScan</a>
                        </div>
                    </li>
                    <li>
                        <span class="font-weight-bold li-span">Estimated conversion transaction fee</span>
                        <div class="d-flex flex-column mt-4 li-span">
                            <div v-if="fromWrapSelected.symbol !== 'ETH' && !isApproved">Approve: ~{{ estimateApprovement }} ETH</div>
                            <div>Swap: ~{{ estimateSwap }} ETH</div>
                            <div class="text-danger font-weight-bold">Total: ~{{ estimateTotal }} ETH</div>
                        </div>
                    </li>
                </ul>
            </b-col>
            <b-col cols="6">
                <b-form-group
                    class="mb-4 font-weight-bold"
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
                    font-scale="1.5"/>
                Back
            </b-button>
            <b-button
                :disabled="!agreeAll || !agreeEx || !agreeEx || !depAmount || !recAddress"
                class="btn--big st-next"
                @click="redirectFunction">
                {{ wrapButtonTitle }}
                <b-icon
                    class="light-h"
                    icon="arrow-right-short"
                    font-scale="1.5"/>
            </b-button>
        </div>
        <div
            :class="(loading ? 'tomo-loading' : '')"/>
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
            isApproved: true,
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
            estimateApprovement: '',
            estimateSwap: '',
            estimateTotal: '',
            ethGasPrice: '',
            wrapButtonTitle: 'Next',
            loading: false,
            ethIds: [1, 3, 4, 5]
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

            this.web3Eth.eth.getGasPrice()
                .then(data => {
                    this.ethGasPrice = data
                })
                .catch(error => console.log(error))

            this.tomoScanUrl = urljoin(
                config.tomoscanUrl,
                'tokens',
                this.fromWrapSelected.wrapperAddress
            )
            this.getTokenBalance(this.fromWrapSelected)
            this.checkApprove()
            this.estimateGasSwap()
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
                const balanceEthBN = await this.web3Eth.eth.getBalance(this.address)
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
                let bl = await this.web3Eth.eth.getBalance(this.address)
                console.log(bl)
                this.tokenBalanceToFixed = new BigNumber(bl).div(10 ** 18).toFixed(5)
                break
            case 'BTC':
                this.tokenBalanceToFixed = 0
                break
            default:
                const contract = new this.web3Eth.eth.Contract(
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
        async selectToken (token) {
            this.estimateTotal = ''
            this.estimateSwap = ''
            this.fromWrapSelected = token
            const config = this.config
            this.tomoScanUrl = urljoin(
                config.tomoscanUrl,
                'tokens',
                token.wrapperAddress
            )
            if (token.symbol === 'ETH') {
                this.wrapButtonTitle = 'Next'
                this.isApproved = true
            } else {
                this.isApproved = false
            }
            await this.checkApprove(token)
            await this.getTokenBalance(token)
            this.estimateGasSwap(token)
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
        async checkApprove (token = this.fromWrapSelected) {
            try {
                console.log(token)
                const config = this.config
                if (token.tokenAddress) {
                    const contract = new this.web3.eth.Contract(
                        this.ERC20Abi.abi,
                        token.tokenAddress
                    )

                    const allowance = await contract.methods.allowance(this.address, config.blockchain.contractBridgeEth).call()

                    if (new BigNumber(allowance).isLessThanOrEqualTo(0)) {
                        this.isApproved = false
                        this.wrapButtonTitle = 'Approve'
                        contract.methods.approve(
                            config.blockchain.contractBridgeEth,
                            new BigNumber(2).exponentiatedBy(256).minus(1).toString(10)
                        ).estimateGas({
                            from: this.address
                        }).then(data => {
                            this.estimateApprovement = new BigNumber(data).multipliedBy(this.ethGasPrice)
                                .div(10 ** 18).toNumber()
                            this.estimateTotal += this.estimateApprovement
                        }).catch(error => {
                            this.$toasted.show('Check approvement error: ', error.message ? error.message : error, { type: 'error' })
                        })
                    } else {
                        this.isApproved = true
                        this.wrapButtonTitle = 'Next'
                    }
                }
            } catch (error) {
                console.log(error)
                this.$toasted.show(`Estimate approvement fee error: ${error.message ? error.message : error}`, { type: 'error' })
            }
        },
        async estimateGasSwap (token = this.fromWrapSelected) {
            try {
                const config = this.config
                let price
                const contract = new this.web3Eth.eth.Contract(
                    this.ContractBridgeEthAbi.abi,
                    config.blockchain.contractBridgeEth
                )
                if (token.tokenAddress && this.isApproved) {
                    const estimateGas = await contract.methods.swapErc20(
                        token.tokenAddress,
                        this.recAddress || this.address,
                        new BigNumber(this.depAmount || 1).multipliedBy(10 ** token.decimals).toString(10)
                    ).estimateGas({
                        from: this.address
                    })
                    price = new BigNumber(estimateGas).multipliedBy(this.ethGasPrice).div(10 ** 18)
                } else if (token.symbol === 'ETH') {
                    const estimateGas = await contract.methods.swapEth(
                        this.recAddress || this.address
                    ).estimateGas({
                        from: this.address,
                        value: 12
                    })
                    price = new BigNumber(estimateGas).multipliedBy(this.ethGasPrice).div(10 ** 18)
                }
                if (price) {
                    this.estimateSwap = price
                    this.estimateTotal += price.toNumber()
                }
            } catch (error) {
                console.log(error)
                this.$toasted.show(`Estimate swap fee error: ${error.message ? error.message : error}`, { type: 'error' })
            }
        },
        async approveContract () {
            try {
                this.loading = true
                const config = this.config
                const contract = new this.web3.eth.Contract(
                    this.ERC20Abi.abi,
                    this.fromWrapSelected.tokenAddress
                )
                await contract.methods.approve(
                    config.blockchain.contractBridgeEth,
                    // new BigNumber(100000).multipliedBy(10 ** this.fromWrapSelected.decimals).toString(10)
                    new BigNumber(2).exponentiatedBy(256).minus(1).toString(10)
                ).send({ from: this.address }).on('transactionHash', async txHash => {
                    let check = true
                    while (check) {
                        const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                        if (receipt) {
                            this.isApproved = true
                            this.loading = false
                            check = false
                            this.selectToken(this.fromWrapSelected)
                        }
                    }
                }).catch(error => {
                    console.log(error)
                    this.loading = false
                    this.$toasted.show(error.message ? error.message : error, { type: 'error' })
                })
            } catch (error) {
                console.log(error)
                this.loading = false
                this.$toasted.show('Approvement error:', error.message ? error.message : error, { type: 'error' })
            }
        },
        redirectFunction () {
            if (this.isApproved) {
                this.wrapToken()
            } else {
                this.approveContract()
            }
        },
        wrapToken () {
            if (this.ethIds.indexOf(this.network.chainId) > -1) {
                const coin = this.fromWrapSelected
                this.isAddress = this.isValidAddresss()
                if (this.isAddress) {
                    if (!this.agreeAll || !this.agreeEx || !this.agreePk) {
                        this.$toasted.show('Confirmation required', { type: 'error' })
                        // this.allChecked = true
                    } else if (new BigNumber(this.depAmount).isGreaterThan(this.tokenBalance)) {
                        this.$toasted.show(`Not enough ${coin.symbol}`, { type: 'error' })
                    } else {
                        this.$router.push({
                            name: 'WrapExecution',
                            params: {
                                receiveAddress: this.recAddress,
                                fromWrapSelected: this.fromWrapSelected,
                                depAmount: this.depAmount
                            }
                        })
                    }
                } else {
                    this.$toasted.show('Invalid recipient address', { type: 'error' })
                }
            } else { this.$toasted.show('Set your Metamask network to Ethereum', { type: 'error' }) }
        }
    }
}
</script>
