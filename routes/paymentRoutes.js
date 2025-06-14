const express = require('express')
const paymentController = require('../controller/PaymentController')
const authToken = require('../middlewares/authToken')
const webhooks = require('../controller/webhook')
const orderController = require('../controller/orderController')
const allOrderController = require('../controller/allOrderController')
const router = express.Router()

router.post('/api/checkout',authToken, paymentController)
router.post('/webhook', webhooks)
router.get('/api/order-list',authToken, orderController)

// dashboard
router.get("/api/all-order",authToken,allOrderController)



module.exports = router 