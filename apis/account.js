'use strict'
const express = require('express')
// const urljoin = require('url-join')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const db = require('../models/mongodb')
const Web3 = require('web3')
const config = require('config')

router.get('/getUnclaimTx/:address', [], async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(errors.array())
    }
    try {
        const address = req.params.address
        const result = await db.Transaction.findOne({
            signer: address.toLowerCase(),
            isClaim: false,
            status: 'confirmed'
        })
        return res.json(result)
    } catch (error) {
        return next(new Error(error))
    }
})

router.post('/updateTx', [
    check('address').exists().isLength({ min: 42, max: 42 }).withMessage("'address' is incorrect."),
    check('coin').exists().withMessage("'coin' is required."),
    check('burnTx').exists().withMessage("'burnTx' is required.").isLength({ min: 66, max: 66 }).withMessage("'burnTx' is incorrect."),
    check('claimTx').optional().isLength({ min: 66, max: 66 }).withMessage("'claimTx' is incorrect."),
    check('isClaim').exists().isBoolean().withMessage("'isClaim' is required."),
    check('receivingAddress').exists().isLength({ min: 42, max: 42 }).withMessage("'receivingAddress' is incorrect.")
], async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(errors.array())
    }
    try {
        const address = req.body.address
        const burnTx = req.body.burnTx
        const claimTx = req.body.claimTx || ''
        const coin = req.body.coin
        const amount = req.body.amount
        const receivingAddress = req.body.receivingAddress
        const status = req.body.status || ''
        let data = {
            signer: address.toLowerCase(),
            isClaim: req.body.isClaim,
            coin: coin.toLowerCase(),
            burnTx,
            amount,
            receivingAddress: receivingAddress.toLowerCase(),
            status
        }
        if (claimTx) {
            data.claimTx = claimTx
        }

        const web3 = new Web3()
        if (!web3.utils.isAddress(address)) {
            return next(new Error('address is invalid'))
        } else {
            await db.Transaction.updateOne({
                signer: address.toLowerCase(),
                coin: coin.toLowerCase(),
                burnTx: burnTx
            }, { $set: data }, { upsert: true })
        }
        return res.json(data)
    } catch (error) {
        return res.send('Cannot find tx')
    }
})

router.post('/updateClaimTxWithKey', [
    check('address').exists().isLength({ min: 42, max: 42 }).withMessage("'address' is incorrect."),
    check('burnTx').exists().withMessage("'burnTx' is required.").isLength({ min: 66, max: 66 }).withMessage("'burnTx' is incorrect."),
    check('claimTx').optional().isLength({ min: 66, max: 66 }).withMessage("'claimTx' is incorrect.")
], async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(errors.array())
    }
    try {
        if (!req.headers.authorization || req.headers.authorization !== config.get('apiKey')) {
            return next(new Error('Not Acceptable'))
        } else {
            const address = req.body.address
            const burnTx = req.body.burnTx
            const claimTx = req.body.claimTx || ''
            let data = await db.Transaction.findOne({
                signer: address.toLowerCase(),
                burnTx: burnTx
            })
            if (!data) {
                return next(new Error('Tx not found'))
            } else {
                const web3 = new Web3()
                if (!web3.utils.isAddress(address)) {
                    return next(new Error('address is invalid'))
                } else {
                    await db.Transaction.updateOne({
                        signer: address.toLowerCase(),
                        burnTx: burnTx
                    }, {
                        $set: {
                            claimTx,
                            isClaim: true,
                            status: 'claimed'
                        }
                    }, { upsert: true })
                }
            }
            let data1 = await db.Transaction.findOne({
                signer: address.toLowerCase(),
                burnTx: burnTx
            })
            return res.json(data1)
        }
    } catch (error) {
        return next(error)
    }
})

module.exports = router
