<template>
    <b-container>
        <div
            v-if="!address"
            class="login-wallet mb-4 row">
            <div
                class="connect col-12">
                <div id="login">
                    <div class="login__buttons">
                        <div class="txt-infor">
                            <p class="txt-dec mb-1">Connect wallet to continue</p>
                            <div class="d-flex align-items-center">
                                <img
                                    width="24"
                                    height="24"
                                    src="/app/assets/images/metamask.png"
                                    alt="Metamask">
                                <span class="title-tmp-medium ml-2">METAMASK</span>
                            </div>
                        </div>
                        <b-button
                            @click="loginMetamask">
                            Connect now
                        </b-button>
                    </div>
                </div>
            </div>
        </div>
        <div
            v-else
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
                <div class="box-address-infor mt-2 mt-md-3">
                    <span
                        class="text-gray mr-3">
                        Balance: {{ balance }} {{ tomoIds.indexOf(network.chainId || '') > -1 ? 'TOMO' : 'ETH' }}
                    </span>
                    <a
                        :href="scanUrl"
                        target="_blank"
                        class="text-blue ml-md-5">
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

        <b-container class="container-medium">
            <!-- <p
                v-if="isClaimable"
                class="text-center">Timestamp: {{ dateTime }}</p> -->

            <div class="claim-modal">
                <b-row>
                    <b-col cols="12">
                        <b-form-group
                            class="font-weight-bold"
                            label="Approved burn TxHash">
                            <b-form-input
                                v-model="burnTx"
                                class="infor-detail"
                                placeholder="Enter burn tx hash..."/>
                        </b-form-group>
                    </b-col>
                    <b-col
                        v-if="isClaimable"
                        cols="12">
                        <b-form-group
                            class="font-weight-bold"
                            label="Signer">
                            <div class="infor-detail">
                                {{ mobileCheck ? truncate(signer, 36) : signer }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col
                        v-if="isClaimable"
                        cols="12">
                        <b-form-group
                            class="font-weight-bold"
                            label="Recipient">
                            <div class="infor-detail">
                                {{ mobileCheck ? truncate(recipient, 36) : recipient }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col
                        v-if="isClaimable"
                        cols="6">
                        <b-form-group
                            class="font-weight-bold"
                            label="Token name">
                            <div class="infor-detail">
                                <img
                                    v-if="coinImg"
                                    :src="coinImg"
                                    class="claim_img">
                                {{ (token || '').toUpperCase() }}
                            </div>
                        </b-form-group>
                    </b-col>
                    <b-col
                        v-if="isClaimable"
                        cols="6">
                        <b-form-group
                            class="font-weight-bold overflow-hidden"
                            label="Amount">
                            <div class="infor-detail">
                                {{ amount }}
                            </div>
                        </b-form-group>
                    </b-col>
                </b-row>
            </div>
            <div
                v-if="!isClaimable && !signing && !claimTxHash"
                class="mt-2">
                <b-button
                    class="btn-green w-100"
                    @click="searchTx">Search</b-button>
            </div>
            <div
                v-if="isClaimable && !signing && !claimTxHash"
                class="mt-2">
                <b-button
                    class="btn-green w-100"
                    @click="claimAsset">Claim {{ (token || '').toUpperCase() }}</b-button>
            </div>
            <div
                v-if="isClaimable && signing"
                class="mt-2 text-center">
                <b-button
                    class="btn-green w-100"
                    style="pointer: default">
                    Please keep the window open
                </b-button>
            </div>
            <div
                v-if="claimTxHash && !signing"
                class="mt-2 text-center">
                <b-button
                    class="btn-green w-100 mb-3"
                    style="pointer: default">
                    Successfylly converted assets!
                </b-button>
                <a
                    :href="explorerUrl"
                    target="_blank">Check transaction on etherscan</a>
            </div>
        </b-container>
        <div
            :class="(loading ? 'tomo-loading' : '')"/>
    </b-container>
</template>
<script>
import urljoin from 'url-join'
import Helper from '../utils'
import Web3 from 'web3'
import axios from 'axios'
import store from 'store'
import BigNumber from 'bignumber.js'
export default {
    name: 'App',
    components: {
    },
    data () {
        return {
            provider: '',
            tomoIds: [88, 89, 99],
            ethIds: [1, 3, 4, 5],
            scanUrl: '#',
            explorerUrl: '#',
            burnTxUrl: '#',
            dateTime: '',
            coinImg: '',
            burnTx: '',
            token: '',
            amount: '',
            isClaimable: false,
            loading: false,
            recipient: '',
            signer: '',
            claimTxHash: '',
            txObj: {},
            txDataOnHub: {},
            signing: false
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
            const pendingWithdraw = store.get('pendingWithdraw')
            if (pendingWithdraw) {
                this.burnTx = pendingWithdraw.burnTx
            }
            this.searchTx()
        }
    },
    methods: {
        signOut () {
            this.$store.state.address = ''
            this.$store.state.network = ''
            this.isClaimable = false
            this.burnTx = ''
        },
        async loginMetamask () {
            try {
                this.loading = true
                if (window.ethereum) {
                    this.loading = true
                    const walletProvider = window.ethereum
                    const wjs = new Web3(walletProvider)

                    await this.setupProvider('metamask', wjs)
                    const data = await this.getChainId()
                    this.$store.state.network = Helper.networks[data] || { name: 'Unknown', chainId: 0 }
                    const address = await this.getAccount()

                    this.getBalance(address).then(data => {
                        if (data) {
                            this.$store.state.balance = data.toFixed(5)
                        }
                    }).catch(error => console.log(error))

                    this.$store.state.address = address
                    this.$store.state.provider = 'metamask'
                    this.loading = false
                    const pendingWithdraw = store.get('pendingWithdraw')
                    if (pendingWithdraw) {
                        this.burnTx = pendingWithdraw.burnTx
                    }
                    this.searchTx()
                } else {
                    this.loading = false
                    this.$toasted.show('Please install Metamask', { type: 'error' })
                }
            } catch (error) {
                this.loading = false
                console.log(error)
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        },
        async scanTX () {
            try {
                const txData = await axios.get(
                    `/api/wrap/getTransaction/${this.burnTx}`
                )
                if (txData && txData.data) {
                    return txData.data
                }
            } catch (error) {
                console.log(error)
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        },

        async getTxDataFromHub () {
            const config = this.config
            const hubContract = new this.web3Tomo.eth.Contract(
                this.ContractBridgeTomoAbi.abi,
                config.blockchain.contractBridgeTomo
            )
            const txData = await hubContract.methods.Transactions(this.burnTx).call()
            return txData
        },
        async searchTx () {
            try {
                if (this.address && this.burnTx) {
                    this.loading = true
                    const config = this.config
                    let data = await this.scanTX()
                    if (data && data.transaction) {
                        this.txObj = data.transaction.OutTx
                        this.token = this.txObj.CoinType.toLowerCase()
                        let signatureBytes = []
                        if (this.txObj.Hash === this.burnTx &&
                            this.txObj.Status.toLowerCase() === 'signed_on_hub' && this.txObj.Signature) {
                            signatureBytes = this.web3Eth.utils.hexToBytes(this.txObj.Signature)

                            const contract = new this.web3Eth.eth.Contract(
                                this.ContractBridgeEthAbi.abi,
                                config.blockchain.contractBridgeEth
                            )
                            const txDataPromise = this.getTxDataFromHub()

                            const isClaim = await contract.methods.usedNonce(signatureBytes).call()
                            if (!isClaim) {
                                const txData = await txDataPromise
                                if (txData.signed) {
                                    this.txDataOnHub = txData
                                    const tokenData = this.config.objSwapCoin[this.token.toLowerCase()]
                                    this.isClaimable = true
                                    this.recipient = txData.recipient
                                    this.signer = this.txObj.From
                                    this.amount = new BigNumber(txData.amount).div(10 ** tokenData.decimals)
                                    this.loading = false
                                } else {
                                    this.loading = false
                                    this.$toasted.show('Cannot find transaction', { type: 'error' })
                                }
                            } else {
                                this.loading = false
                                this.$toasted.show('This transaction has claimed')
                            }
                        } else {
                            this.loading = false
                            this.$toasted.show('Transaction has not finished yet, please wait or contract support', { type: 'error' })
                        }
                    } else {
                        this.isClaimable = false
                        this.loading = false
                        this.$toasted.show('Cannot find transaction', { type: 'error' })
                    }
                }
            } catch (error) {
                console.log(error)
                this.loading = false
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        },
        async estimateGas () {
            try {
                const config = this.config
                let estimateGas
                const contract = new this.web3.eth.Contract(
                    this.ContractBridgeEthAbi.abi,
                    config.blockchain.contractBridgeEth
                )
                if (this.token.toLowerCase() !== 'eth') {
                    estimateGas = await contract.methods.withdrawERC20(
                        this.txDataOnHub.tokenAddress,
                        this.recipient,
                        this.txDataOnHub.amount,
                        this.txObj.ScID,
                        this.txObj.Hash,
                        0,
                        this.txObj.Signature
                    ).estimateGas({
                        from: this.address
                    })
                } else {
                    estimateGas = await contract.methods.withdrawEth(
                        this.recipient,
                        this.txDataOnHub.amount,
                        this.txObj.ScID,
                        this.txObj.Hash,
                        0, // target_chain
                        this.txObj.Signature
                    ).estimateGas({
                        from: this.address
                    })
                }
                return estimateGas
            } catch (error) {
                console.log(error)
            }
        },
        async claimAsset () {
            try {
                const config = this.config
                const chainId = await this.getChainId()
                if (this.ethIds.indexOf(chainId) > -1) {
                    this.loading = true
                    this.signing = true
                    const contract = new this.web3.eth.Contract(
                        this.ContractBridgeEthAbi.abi,
                        config.blockchain.contractBridgeEth
                    )

                    let estimateGas = await this.estimateGas()
                    if (!estimateGas) { estimateGas = 150000 }

                    const txParams = {
                        from: this.address,
                        gas: new BigNumber(estimateGas).isGreaterThan(150000) ? 150000 : estimateGas,
                        gasPrice: this.ethGasPrice,
                        nonce: await this.web3.eth.getTransactionCount(this.address)
                    }

                    if (this.token.toLowerCase() !== 'eth') {
                        await contract.methods.withdrawERC20(
                            this.txDataOnHub.tokenAddress,
                            this.recipient || this.txObj.To,
                            this.txDataOnHub.amount,
                            this.txObj.ScID,
                            this.txObj.Hash,
                            0,
                            this.txObj.Signature
                        ).send(txParams)
                            .on('transactionHash', async txHash => {
                                let check = true
                                this.claimTxHash = txHash
                                while (check) {
                                    const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                                    if (receipt && receipt.status) {
                                        await this.updateTransaction()
                                        store.remove('pendingWithdraw')
                                        this.loading = false
                                        this.signing = false
                                        this.explorerUrl = urljoin(
                                            config.etherChain.etherScanURL,
                                            'tx',
                                            txHash
                                        )
                                        check = false
                                    }
                                }
                            }).catch(error => {
                                console.log(error)
                                this.loading = false
                                this.signing = false
                                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
                            })
                    } else {
                        await contract.methods.withdrawEth(
                            this.recipient || this.txObj.To,
                            this.txDataOnHuba.amount,
                            this.txObj.ScID,
                            this.txObj.Hash,
                            0, // target_chain
                            this.txObj.Signature
                        ).send(txParams)
                            .on('transactionHash', async txHash => {
                                let check = true
                                this.claimTxHash = txHash
                                while (check) {
                                    const receipt = await this.web3.eth.getTransactionReceipt(txHash)
                                    if (receipt && receipt.status) {
                                        await this.updateTransaction()
                                        this.loading = false
                                        this.signing = false
                                        this.explorerUrl = urljoin(
                                            config.etherChain.etherScanURL,
                                            'tx',
                                            txHash
                                        )
                                        check = false
                                    }
                                }
                            }).catch(error => {
                                console.log(error)
                                this.loading = false
                                this.signing = false
                                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
                            })
                    }
                } else { this.$toasted.show('Need Ethereum network to claim asset', { type: 'error' }) }
            } catch (error) {
                console.log(error)
                this.loading = false
                this.signing = false
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        },
        async updateTransaction () {
            try {
                axios.post('/api/account/updateTx', {
                    address: this.signer,
                    burnTx: this.burnTx,
                    coin: this.token.toLowerCase(),
                    claimTx: this.claimTxHash,
                    isClaim: true,
                    amount: this.amount,
                    receivingAddress: this.recipient,
                    status: 'confirmed'
                })
            } catch (error) {
                console.log(error)
                this.$toasted.show(error.message ? error.message : error, { type: 'error' })
            }
        }
    }
}
</script>
