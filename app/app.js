import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vuex from 'vuex'
import Toasted from 'vue-toasted'
import VueI18n from 'vue-i18n'
import Web3 from 'web3'
import localStorage from 'store'
import TransactionTx from 'ethereumjs-tx'

import routes from './routes'

import Helper from './utils'

import ERC20Abi from '../abis/ERC20.json'
import ContractBridgeEth from '../abis/ContractBridgeEth.json'
import TomoBridgeTokenAbi from '../abis/TomoBridgeWrapToken.json'
import ContractBridgeTomo from '../abis/ContractBridgeTomo.json'

import en from './assets/translation/en.json'
import vi from './assets/translation/vi.json'
import tr from './assets/translation/tr.json'
import ja from './assets/translation/ja.json'
import cn from './assets/translation/cn.json'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Toasted, {
    position: 'bottom-right',
    theme: 'bubble',
    duration: 4000,
    action : {
        text : 'Dismiss',
        onClick : (e, toastObject) => {
            toastObject.goAway(0)
        }
    },
    singleton: true
})

Vue.use(VueI18n)
const i18n = new VueI18n({
    locale: 'en',
    messages: {
        en,
        vi,
        tr,
        ja,
        cn
    }
})

const store = new Vuex.Store({
    state: {
        address: '',
        network: '',
        provider: '',
        redirectTo: '',
        config: {},
        balance: 0,
        unClaimTx: {}
    },
    getters: {
        address: state => state.address,
        network: state => state.network,
        config: state => state.config,
        balance: state => state.balance,
        unClaimTx: state => state.unClaimTx
    }
})
Vue.prototype.web3Eth = ''
Vue.prototype.setupProvider = async function (provider, wjs) {
    Vue.prototype.NetworkProvider = provider
    if (wjs instanceof Web3) {
        Vue.prototype.web3 = wjs
        Vue.prototype.TomoBridgeTokenAbi = TomoBridgeTokenAbi
        Vue.prototype.ERC20Abi = ERC20Abi
        Vue.prototype.ContractBridgeEthAbi = ContractBridgeEth
        Vue.prototype.ContractBridgeTomoAbi = ContractBridgeTomo
        let config = localStorage.get('configBridge')
        Vue.prototype.web3Eth = new Web3(new Web3.providers.HttpProvider(config.etherChain.rpc))
        Vue.prototype.web3Tomo = new Web3(new Web3.providers.HttpProvider(config.blockchain.rpc))
    }
}

Vue.prototype.getAccount = async function () {
    const provider = Vue.prototype.NetworkProvider || ''
    const web3 = Vue.prototype.web3
    let account
    switch (provider) {
    case 'metamask':
        // Request account access if needed - for metamask
        if (window.ethereum) {
            // await window.ethereum.enable()
            await window.ethereum.request({ method: 'eth_requestAccounts' })
        }
        account = (await web3.eth.getAccounts())[0]
        break
    case 'pantograph':
        // Request account access if needed - for pantograph
        if (window.tomochain) {
            await window.tomochain.enable()
        }
        account = (await web3.eth.getAccounts())[0]
        break
    case 'tomowallet':
        account = (await web3.eth.getAccounts())[0]
        break
    default:
        break
    }
    if (!account || account.length <= 0) {
        console.log(`Couldn't get any accounts! Make sure
            your Ethereum client is configured correctly.`)
    }
    return account
}

/**
 * @param object txParams
 * @param object signature {r,s,v}
 * @return transactionReceipt
 */
 Vue.prototype.sendSignedTransaction = function (txParams, signature) {
    return new Promise((resolve, reject) => {
        try {
            let serializedTx
            // "hexify" the keys
            Object.keys(signature).map((key, _) => {
                if (signature[key].startsWith('0x')) {
                    return signature[key]
                } else signature[key] = '0x' + signature[key]
            })
            let txObj = Object.assign({}, txParams, signature)
            const tx = new TransactionTx(txObj)

            serializedTx = '0x' + tx.serialize().toString('hex')
            // web3 v0.2, method name is sendRawTransaction
            // You are using web3 v1.0. The method was renamed to sendSignedTransaction.

            Vue.prototype.web3Eth.eth.sendSignedTransaction(
                serializedTx
            ).on('transactionHash', (txHash) => {
                resolve(txHash)
            }).catch(error => reject(error))
            // if (!rs.tx && rs.transactionHash) {
            //     rs.tx = rs.transactionHash
            // }
        } catch (error) {
            reject(error)
        }
    })
}

Vue.prototype.getChainId = Helper.getChainId

Vue.prototype.truncate = Helper.truncate

Vue.prototype.appConfig = Helper.getConfig
Vue.prototype.getBalance = Helper.getBalance
Vue.prototype.string2byte = Helper.string2byte

const EventBus = new Vue()

Vue.prototype.$bus = EventBus

const router = new VueRouter({
    mode: 'history',
    routes
})

new Vue({ // eslint-disable-line no-new
    el: '#app',
    i18n,
    store,
    router: router,
    components: { App },
    data: {
        language: 'en'
    },
    template: '<App/>'
})
