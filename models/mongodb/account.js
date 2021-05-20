'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Account = new Schema({
    address: {
        type: String,
        index: true,
        unique: true
    },
    withdrawal: [{
        coin: String,
        burnTx: String,
        claimTx: String,
        isClaim: Boolean
    }]
}, { timestamps: true })

module.exports = mongoose.model('Account', Account)
