const express = require('express')
const router = express.Router()
const addToCartController = require('../controller/addToCartController')
const authToken = require('../middlewares/authToken')

router.post('/api/addToCart', authToken, addToCartController.addToCart)
router.get('/api/countAddToCartProduct', authToken, addToCartController.countAddToCartProduct)
router.get('/api/addToCartViewProduct', authToken, addToCartController.addToCartViewProduct)
router.post("/api/updateCartProduct", authToken, addToCartController.updateAddToCartProduct)
router.post("/api/deleteCartProduct", authToken, addToCartController.deleteAddToCartProduct)



module.exports = router     