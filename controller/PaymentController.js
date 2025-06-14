const userModel = require('../models/userModel');
const stripe = require('../utils/stripe');

const paymentController = async (req, res) => {
    try {
        const { cartItems } = req.body;

        const user = await userModel.findOne({ _id: req.userId })

        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            shipping_options: [
                {
                    shipping_rate: "shr_1PZXHjLPhC5lMBzT9uKfLhTp"
                }
            ],
            customer_email: user.email,
            metadata:{
                userId:req.userId
            },
            line_items: cartItems.map((item, index) => {
                return {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            code: item.productId.productCode,
                            images: item.productId.productImage,
                            metadata: {
                                productId: item.productId._id
                            }
                        },
                        unit_amount: item.productId.price * 100
                    },
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${process.env.forntend_url}/success`,
            cancel_url: `${process.env.forntend_url}/cancel`

        }

        const session = await stripe.checkout.sessions.create(params)
        res.status(200).json(session)

    } catch (error) {
        res.json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


module.exports = paymentController