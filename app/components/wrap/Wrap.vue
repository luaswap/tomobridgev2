<template>
    <div class="container">
        <AddressInfo/>
        <b-container
            class="container-medium">
            <div class="open-product text-center">
                <h1 class="title-tmp-large">
                    SELECT ASSET TO CONVERT
                </h1>
                <p class="txt-dec-tem-2 font-weight-bold">
                    {{ fromWrapSelected.symbol !== 'ETH' && fromWrapSelected.symbol !== 'BTC' ? 'ERC-20' : '' }}
                    {{ fromWrapSelected.symbol }} <span class="txt-dec">to</span> TomoChain wrapped {{ fromWrapSelected.symbol }}
                </p>
            </div>

            <b-row class="wrapbox__row mb-lg-4 mt-4">
                <b-col cols="7">
                    <b-form-group
                        class="mb-4 font-weight-bold"
                        label="Asset"
                        label-for="amount">
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
                                    <div class="d-flex align-items-center">
                                        <img
                                            v-if="props.option.image"
                                            :src="props.option.image"
                                            class="multiselect__img">
                                        <span class="multiselect__name">{{ props.option.symbol }}</span>
                                        <i
                                            v-if="(verifiedList.indexOf((props.option.wrapperAddress || '').toLowerCase()) > 0)
                                                || props.option.symbol === 'BTC' || props.option.symbol === 'ETH'"
                                            class="tb-check-circle-o multiselect_greentick ml-2"/>
                                    </div>
                                    <div
                                        v-if="tokenBalanceToFixed > 0"
                                        class="text-right mr-4 font-weight-normal">{{ tokenBalanceToFixed }}</div>
                                </div>
                            </template>
                            <template
                                slot="option"
                                slot-scope="props">
                                <div class="d-flex align-items-center">
                                    <img
                                        v-if="props.option.image"
                                        :src="props.option.image"
                                        class="multiselect__img">
                                    <span class="multiselect__name">{{ props.option.symbol }}</span>
                                    <i
                                        v-if="(verifiedList.indexOf((props.option.wrapperAddress || '').toLowerCase()) > 0)
                                            || props.option.symbol === 'BTC' || props.option.symbol === 'ETH'"
                                        class="tb-check-circle-o multiselect_greentick ml-2"/>
                                </div>
                            </template>
                        </multiselect>
                    </b-form-group>
                </b-col>
                <b-col cols="5">
                    <b-form-group
                        class="mb-4 font-weight-bold"
                        label="Amount"
                        label-for="depAmount">
                        <b-form-input
                            v-model="depAmount"
                            type="number"
                            placeholder="Deposit amount"
                            @input="onChangeAmount"/>
                        <b-button
                            class="token-max"
                            variant="success"
                            @click="maxToken">
                            Max
                        </b-button>
                    </b-form-group>

                </b-col>
                <b-col cols="12">

                    <b-form-group
                        class="mb-4 font-weight-bold"
                        label="Receiving Address"
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

            <div class="box-more-infor">
                <div class="txt-cdgt">
                    View Wrapped Token address on
                    <a
                        :href="tomoScanUrl"
                        target="_blank">TomoScan</a>
                </div>

                <div class="content-fee">
                    <div class="pr-2">Estimate transaction fee:</div>
                    <div class="infor-fee mt-2">
                        <div
                            v-if="fromWrapSelected.symbol !== 'ETH' && !isApproved"
                            class="px-3">
                            Approve: ~{{ estimateApprovement }} ETH
                        </div>
                        <div class="px-3">Swap: ~{{ estimateSwap }} ETH</div>
                        <div class="px-3">Total: ~{{ estimateTotal }} ETH</div>
                    </div>
                </div>
                <div class="txt-confirm">
                    <p class="font-weight-bold mb-2">Please confirm the following:</p>
                    <b-form-checkbox
                        v-model="agreeEx"
                        class="mr-1 m1 light-h">
                        The receiving address is NOT created on a centralized exchange (e.g. Binance)
                    </b-form-checkbox>
                    <b-form-checkbox
                        v-model="agreePk"
                        class="mr-1 m1 light-h">
                        I have the Private Key/Mnemonics for the receiving address entered above
                    </b-form-checkbox>
                    <b-form-checkbox
                        v-model="agreeAll"
                        class="mr-1 m1 light-h">
                        I have doubled checked that the receiving address is correct
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
            </div>
            <div class="d-flex mt-4">
                <b-button
                    class="st-back w-100 mr-2"
                    @click="back">
                    Back
                </b-button>
                <b-button
                    v-if="!isApproved"
                    class="st-next w-100 ml-2"
                    @click="approveContract">
                    Approve
                </b-button>
                <b-button
                    v-else
                    :disabled="!agreeAll || !agreeEx || !agreeEx || !depAmount || !recAddress"
                    class="st-next w-100 ml-2"
                    @click="wrapToken">
                    Next
                </b-button>
            </div>
            <div
                :class="(loading ? 'tomo-loading' : '')"/>
        </b-container>

    </div>
</template>

<script>
import BigNumber from 'bignumber.js'
import Multiselect from 'vue-multiselect'
import urljoin from 'url-join'
import WAValidator from 'wallet-address-validator'
import AddressInfo from './../Address.vue'
export default {
    name: 'App',
    components: {
        Multiselect,
        AddressInfo
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
        },
        mobileCheck: () => {
            const isAndroid = navigator.userAgent.match(/Android/i)
            const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i)
            return (isAndroid || isIOS)
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
            if (this.fromWrapSelected.symbol === 'ETH') {
                this.wrapButtonTitle = 'Next'
                this.isApproved = true
            } else {
                this.isApproved = false
            }

            await this.web3Eth.eth.getGasPrice()
                .then(async data => {
                    this.ethGasPrice = data
                    this.getTokenBalance(this.fromWrapSelected)
                    await this.checkApprove()
                    this.estimateGasSwap()
                })
                .catch(error => console.log(error))

            this.tomoScanUrl = urljoin(
                config.tomoscanUrl,
                'tokens',
                this.fromWrapSelected.wrapperAddress
            )
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
                this.depAmount = new BigNumber(balanceEthBN).div(10 ** 18).minus(new BigNumber(this.estimateSwap)).toString(10)
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
            switch (token.symbol.toLowerCase()) {
            case 'eth':
                let bl = await this.web3Eth.eth.getBalance(this.address)
                this.tokenBalance = bl
                this.tokenBalanceToFixed = new BigNumber(bl).div(10 ** 18).toFixed(5)
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
                const checkEthBalance = await this.checkEthBalance()
                if (token.tokenAddress && this.isApproved
                    && new BigNumber(this.depAmount).multipliedBy(10 ** token.decimals).isLessThanOrEqualTo(this.tokenBalance)) {
                    const estimateGas = await contract.methods.swapErc20(
                        token.tokenAddress,
                        this.recAddress || this.address,
                        new BigNumber(this.depAmount || 1).multipliedBy(10 ** token.decimals).toString(10)
                    ).estimateGas({
                        from: this.address
                    })
                    price = new BigNumber(estimateGas).multipliedBy(this.ethGasPrice).div(10 ** 18)
                } else if (token.symbol === 'ETH') {
                    let estimateGas
                    if (!checkEthBalance) {
                        estimateGas = 0
                    } else {
                        estimateGas = await contract.methods.swapEth(
                            this.recAddress || this.address
                        ).estimateGas({
                            from: this.address,
                            value: 12
                        })
                    }

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
                const checkEthBalance = await this.checkEthBalance()
                if (!checkEthBalance) {
                    this.$toasted.show('Not enough ETH', { type: 'error' })
                } else {
                    await contract.methods.approve(
                        config.blockchain.contractBridgeEth,
                        // new BigNumber(100000).multipliedBy(10 ** this.fromWrapSelected.decimals).toString(10)
                        new BigNumber(2).exponentiatedBy(256).minus(1).toString(10)
                    ).send({ from: this.address }).on('transactionHash', async txHash => {
                        let check = true
                        while (check) {
                            const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                            if (receipt && receipt.status) {
                                this.isApproved = true
                                this.wrapButtonTitle = 'Next'
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
                }
            } catch (error) {
                console.log(error)
                this.loading = false
                this.$toasted.show('Approvement error:', error.message ? error.message : error, { type: 'error' })
            }
        },
        async checkEthBalance () {
            let bl = await this.web3Eth.eth.getBalance(this.address)
            if (new BigNumber(bl).isLessThanOrEqualTo(0)) {
                return false
            }
            return true
        },
        async onChangeAmount () {
            this.estimateTotal = ''
            this.estimateSwap = ''
            this.estimateGasSwap()
        },
        async wrapToken () {
            if (this.ethIds.indexOf(this.network.chainId) > -1) {
                const coin = this.fromWrapSelected
                this.isAddress = this.isValidAddresss()
                const checkEthBalance = await this.checkEthBalance()
                const amountInNumber = new BigNumber(this.depAmount).multipliedBy(10 ** this.fromWrapSelected.decimals)

                if (this.isAddress) {
                    if (!this.agreeAll || !this.agreeEx || !this.agreePk) {
                        this.$toasted.show('Confirmation required', { type: 'error' })
                        // this.allChecked = true
                    } else if (!checkEthBalance) {
                        this.$toasted.show(`Not enough ETH`, { type: 'error' })
                    } else if (coin.symbol.toLowerCase() !== 'eth'
                        && new BigNumber(this.depAmount).multipliedBy(10 ** coin.decimals).isGreaterThan(this.tokenBalance)) {
                        this.$toasted.show(`Not enough ${coin.symbol}`, { type: 'error' })
                    } else if (amountInNumber.isLessThan(1)) {
                        this.$toasted.show('Deposit amount is too small', { type: 'error' })
                    } else {
                        if (!Number.isInteger(Number(amountInNumber))) {
                            this.depAmount = new BigNumber(Math.round(amountInNumber)).div(10 ** this.fromWrapSelected.decimals).toString(10)
                        }
                        this.$router.push({
                            name: 'WrapExecution',
                            params: {
                                recAddress: this.recAddress,
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
