import BigNumber from 'bignumber.js'
import Vue from 'vue'
import axios from 'axios'
import * as localStorage from 'store'
import * as ethUtils from 'ethereumjs-util'

const Helper = {
    networks: {
        1: { name: 'ETHEREUM', chainId: 1 },
        3: { name: 'ROPSTEN', chainId: 3 },
        4: { name: 'RINKEBY', chainId: 4 },
        5: { name: 'GOERLY', chainid: 5 },
        88: { name: 'TOMOCHAIN', chainId: 88 },
        89: { name: 'TOMOTESTNET', chainId: 89 },
        99: { name: 'TOMODEVNET', chainId: 99 }
    },
    getCurrencySymbol () {
        return 'TOMO'
    },
    formatCurrencySymbol (number) {
        let unit = this.getCurrencySymbol()

        if (unit === null) {
            unit = 'TOMO'
        }
        return `${number} ${unit}`
    },
    getDefaultState () {
        return {
            items: [],
            status: 'empty'
        }
    },
    truncate (fullStr, strLen) {
        if (fullStr.length <= strLen) return fullStr

        const separator = '...'

        let sepLen = separator.length
        let charsToShow = strLen - sepLen
        let frontChars = Math.ceil(charsToShow / 2)
        let backChars = Math.floor(charsToShow / 2)

        return fullStr.substr(0, frontChars) +
               separator +
               fullStr.substr(fullStr.length - backChars)
    },
    serializeQuery (params, prefix) {
        const query = Object.keys(params).map((key) => {
            const value = params[key]

            if (params.constructor === Array) {
                key = `${prefix}[]`
            } else {
                if (params.constructor === Object) {
                    key = (prefix ? `${prefix}[${key}]` : key)
                }
            }

            return value === 'object' ? this.serializeQuery(value, key) : `${key}=${encodeURIComponent(value)}`
        })

        return [].concat.apply([], query).join('&')
    },
    getSecondsToHms  (number) {
        number = parseInt(number, 10)
        if (number < 0) {
            return 'Available to withdraw'
        }

        number = number * 2

        let h = Math.floor(number / 3600)
        let m = Math.floor(number % 3600 / 60)
        let s = Math.floor(number % 3600 % 60)

        if (h < 10) { h = '0' + h }
        if (m < 10) { m = '0' + m }
        if (s < 10) { s = '0' + s }

        return `${h}:${m}:${s}`
    },
    checkLongNumber (num) {
        let str = num.toString().split('.')

        return (typeof str[1] !== 'undefined' && str[1].length > 3)
    },
    formatNumber (number) {
        let seps = (number || 0).toString().split('.')
        seps[0] = seps[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

        return seps.join('.')
    },
    formatBigNumber (num, dp) {
        if (this.checkLongNumber(num)) {
            return new BigNumber(num).toFormat(dp)
        }

        return this.formatNumber(num)
    },
    async getChainId () {
        const web3 = Vue.prototype.web3
        const chainId = await web3.eth.getId()
        return chainId
    },
    async getConfig () {
        let config = await axios.get('/api/config')
        config.data.objSwapCoin = {}
        config.data.swapCoin.forEach(c => {
            config.data.objSwapCoin[c.symbol.toLowerCase()] = c
        })
        localStorage.set('configBridge', config.data)

        return config.data
    },
    async getBalance (address) {
        try {
            if (Vue.prototype.web3) {
                const web3 = Vue.prototype.web3
                const balanceBN = await web3.eth.getBalance(address)
                const balance = new BigNumber(balanceBN).div(10 ** 18)
                return balance
            }
        } catch (error) {
            console.log(error)
            this.$toasted.show(error.message ? error.message : error, { type: 'error' })
        }
    },
    string2byte (str) {
        let byteArray = []
        for (let j = 0; j < str.length; j++) {
            byteArray.push(str.charCodeAt(j))
        }

        return byteArray
    },
    detachSignature (signature) {
        const signatureBuffer = ethUtils.toBuffer(signature)
        const signatureParams = ethUtils.fromRpcSig(signatureBuffer)
        const result = {
            v: ethUtils.intToHex(signatureParams.v),
            r: ethUtils.bufferToHex(signatureParams.r),
            s: ethUtils.bufferToHex(signatureParams.s)
        }
        return result
    }
}

export default Helper
