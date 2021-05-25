'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Transaction = new Schema({
    signer: { type: String, index: true },
    coin: String,
    burnTx: { type: String, index: true },
    claimTx: { type: String, index: true },
    isClaim: { type: Boolean, index: true }
}, { timestamps: true })

module.exports = mongoose.model('Transaction', Transaction)
