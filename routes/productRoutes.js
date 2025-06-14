const express = require('express')
const router = express.Router()
const productController = require('../controller/productController')
const cloudinary = require("cloudinary");


// Cloudinary Configuration
cloudinary.config({
    cloud_name: "daf8kxmia",
    api_key: 362161735919762,
    api_secret: 'Nj7WfRS7KlYbD8Dnqi5xYn4WoLE',
});
// Delete Image Route
router.post("/api/delete-image", async (req, res) => {

    try {
        const { public_id } = req.body;


        if (!public_id) {
            return res.status(400).json({ error: "Missing public_id" });
        }

        // Delete image from Cloudinary
        const result = await cloudinary.v2.uploader.destroy(public_id);

        if (result.result !== "ok") {
            return res.status(500).json({ error: "Failed to delete image" });
        }

        res.json({ success: true, message: "Image deleted successfully" });
    } catch (error) {
        // console.error("Cloudinary delete error:", error);
        res.status(500).json({ error: "Server error" });
    }
});


router.post('/api/product/add_product', productController.add_product)
router.get('/api/allProduct', productController.get_dashboard_product)
router.put('/api/product/status-update/:product_id', productController.update_product_status)
router.delete('/api/delete/:product_id', productController.delete_product);
router.get('/api/products/:product_id', productController.get_categorywise_product);
router.put('/api/update/:product_id', productController.update_categorywise_product);



// For website 
router.get('/api/product/category/:category', productController.get_product_by_category);
router.get('/api/categories', productController.get_category);
router.get('/api/furniture', productController.get_furniture_only);
router.get('/api/new-products', productController.get_new_products);
router.get('/api/home-solutions', productController.get_home_solution)
router.post('/api/productsDetails', productController.get_products_details)
router.get('/api/search', productController.search_products)

module.exports = router