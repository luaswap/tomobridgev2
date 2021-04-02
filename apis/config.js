'use strict'
const express = require('express')
const config = require('config')
const router = express.Router()

router.get('/', (req, res, next) => {
    const appConfig = {}
    appConfig.blockchain = config.get('blockchain')
    return res.json(appConfig)
})

module.exports = router
