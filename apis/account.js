'use strict'
const express = require('express')
// const urljoin = require('url-join')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const db = require('../models/mongodb')
const Web3 = require('web3')

router.get('/getUnclaimTx/:address', [], async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(errors.array())
    }
    try {
        const address = req.params.address
        const result = await db.Transaction.find({
            signer: address.toLowerCase(),
            isClaim: false
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
    // check('burningTime').optional().isDate().withMessage("'burningTime' must be datetime."),
    check('claimTx').optional().isLength({ min: 66, max: 66 }).withMessage("'claimTx' is incorrect."),
    check('isClaim').exists().isBoolean().withMessage("'isClaim' is required.")
], async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(errors.array())
    }
    try {
        const address = req.body.address
        const burnTx = req.body.burnTx
        const claimTx = req.body.claimTx
        const coin = req.body.coin
        const burningTime = req.body.burningTime
        let data = {
            signer: address.toLowerCase(),
            isClaim: req.body.isClaim,
            coin: coin.toLowerCase(),
            burnTx,
            burningTime
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
            }, data, { upsert: true })
        }
        return res.send('OK')
    } catch (error) {
        return res.send('Cannot find tx')
    }
})

module.exports = router
