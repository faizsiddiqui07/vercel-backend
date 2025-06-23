const express = require('express')
const router = express.Router()
const cloudinary = require("cloudinary");
const { add_project, get_dashboard_project, get_categorywise_project, update_categorywise_project, update_project_status, delete_project, get_project_details } = require('../controller/projectController');


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


router.post('/api/project/add_project', add_project)
router.get('/api/allProjects', get_dashboard_project)
router.put('/api/project/status-update/:project_id', update_project_status)
router.delete('/api/delete/:project_id', delete_project);
router.get('/api/project/:project_id', get_categorywise_project);
router.put('/api/update/:project_id', update_categorywise_project);



// // For website 
router.post('/api/projectDetails', get_project_details)
// router.get('/api/product/category/:category', productController.get_product_by_category);
// router.get('/api/categories', productController.get_category);
// router.get('/api/furniture', productController.get_furniture_only);
// router.get('/api/new-products', productController.get_new_products);
// router.get('/api/home-solutions', productController.get_home_solution)
// router.get('/api/search', productController.search_products)

module.exports = router