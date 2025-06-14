const addToCartModel = require('../models/addToCartModel')


const addToCart = async (req, res) => { 
    try {
        const { productId } = req?.body;
        const currentUser = req.userId;

        const isProductAvailable = await addToCartModel.findOne({ productId, userId: currentUser });

        if (isProductAvailable) {
            return res.json({
                message: "Product already exists in cart", 
                success: false,
                error: true,
            });
        }

        const payload = {
            productId: productId,
            quantity: 1,
            userId: currentUser,
        };

        const newAddToCart = new addToCartModel(payload);
        const saveProduct = await newAddToCart.save();

        return res.status(201).json({
            data: saveProduct,
            message: "Product added to cart",
            success: true,
            error: false,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
            error: true,
        });
    }
};

const countAddToCartProduct = async (req, res) => {
    try {
        const userId = req.userId

        const count = await addToCartModel.countDocuments({
            userId: userId
        })

        res.json({
            data: {
                count: count
            },
            message: "OK",
            success: true,
            error: false
        })
    } catch (error) {
        res.json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

const addToCartViewProduct = async (req, res) => {
    try {
        const currentUser = req.userId

        const allProduct = await addToCartModel.find({
            userId: currentUser
        }).populate("productId")

        res.json({
            data: allProduct,
            success: true,
            error: false
        })

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

const updateAddToCartProduct = async (req, res) => {
    try {
        const currentUserId = req.userId;
        if (!currentUserId) {
            return res.status(401).json({
                message: "Unauthorized",
                error: true,
                success: false,
            });
        }

        const addToCartProductId = req.body._id;
        const qty = req.body.quantity;

        if (!addToCartProductId || qty === undefined) {
            return res.status(400).json({
                message: "Product ID and quantity are required",
                error: true,
                success: false,
            });
        }

        const updateProduct = await addToCartModel.updateOne(
            { _id: addToCartProductId, userId: currentUserId },
            {
                ...(qty && { quantity: qty }),
            }
        );

        if (updateProduct.nModified === 0) {
            return res.status(404).json({
                message: "Product not found or no changes made",
                error: true,
                success: false,
            });
        }

        res.json({
            message: "Product Updated",
            data: updateProduct,
            error: false,
            success: true,
        });

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
};

const deleteAddToCartProduct = async (req, res) => {
    try {
        const currentUserId = req.userId;
        if (!currentUserId) {
            return res.status(401).json({
                message: "Unauthorized",
                error: true,
                success: false,
            });
        }

        const addToCartProductId = req.body._id;
        
        if (!addToCartProductId) {
            return res.status(400).json({
                message: "Product ID is required",
                error: true,
                success: false,
            });
        }

        const deleteProduct = await addToCartModel.deleteOne({ productId: addToCartProductId, userId: currentUserId });

        if (deleteProduct.deletedCount === 0) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false,
            });
        }

        res.json({
            message: "Product successfully deleted from cart",
            error: false,
            success: true,
            data: deleteProduct,
        });

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
};


module.exports = {
    addToCart,
    countAddToCartProduct,
    addToCartViewProduct,
    updateAddToCartProduct,
    deleteAddToCartProduct
}