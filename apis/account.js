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
        // const address = req.params.address
        // const result = await db.Transaction.findOne({
        //     signer: address.toLowerCase(),
        //     isClaim: false
        // })
        const dataFake = {"_id":"60b06536f244cc4f714009b6","burnTx":"0x6feeb390e40e45a4be462e3000a8960f0c9ec6dfbcc93c1fbc9e875a6f177d59","coin":"eth","signer":"0x33c2e732ae7dce8b05f37b2ba0cfe14c980c4dbe","__v":0,"amount":"0.2","burningTime":"2021-05-28T03:36:24.566Z","createdAt":"2021-05-28T03:36:22.932Z","isClaim":false,"updatedAt":"2021-05-28T03:42:13.605Z","claimTx":"0xa57ebae0177a86a6637ce5be76df5d1980af8d6f098b3889d0a4f360532e6243"} // eslint-disable-line
        return res.json(dataFake)
    } catch (error) {
        return next(new Error(error))
    }
})

router.post('/updateTx', [
    check('address').exists().isLength({ min: 42, max: 42 }).withMessage("'address' is incorrect."),
    check('coin').exists().withMessage("'coin' is required."),
    check('burnTx').exists().withMessage("'burnTx' is required.").isLength({ min: 66, max: 66 }).withMessage("'burnTx' is incorrect."),
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
        const claimTx = req.body.claimTx || ''
        const coin = req.body.coin
        const burningTime = req.body.burningTime
        const amount = req.body.amount
        let data = {
            signer: address.toLowerCase(),
            isClaim: req.body.isClaim,
            coin: coin.toLowerCase(),
            burnTx,
            burningTime,
            amount
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
