const moment = require('moment');
const productModel = require('../models/productModel');
const cloudinary = require("cloudinary");

// Add New Product
const add_product = async (req, res) => {
    try {
        const { productCode, category } = req.body;

        if (!productCode || !category) {
            return res.json({
                message: 'All fields are required',
                error: true,
                success: false
            });
        }

        const slug = productCode.split('/').join('-');
        const newProduct = new productModel({
            ...req.body,
            slug,
            date: moment().format('LL'),
        });

        const savedProduct = await newProduct.save();

        return res.status(201).json({
            message: "Product uploaded successfully",
            error: false,
            success: true,
            data: savedProduct
        });
    } catch (error) {
        console.error('Error uploading product:', error);
        return res.status(400).json({
            message: 'Error uploading product',
            error: true,
            success: false
        });
    }
};

// Dashboard - Get All Products
const get_dashboard_product = async (req, res) => {
    try {
        const allProducts = await productModel.find().sort({ createdAt: -1 });
        return res.status(200).json({
            message: "All Products",
            success: true,
            error: false,
            data: allProducts
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Update Product Status
const update_product_status = async (req, res) => {
    try {
        const { product_id } = req.params;
        const { status } = req.body;

        const updatedStatus = await productModel.findByIdAndUpdate(
            product_id,
            { status },
            { new: true }
        );

        return res.status(200).json({
            message: 'Product status updated successfully',
            updatedStatus
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating product status',
            error: true
        });
    }
};

// Delete Product and Images from Cloudinary
const delete_product = async (req, res) => {
    const { product_id } = req.params;

    try {
        const product = await productModel.findById(product_id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (Array.isArray(product.productImage)) {
            for (const img of product.productImage) {
                let public_id = "";

                if (typeof img === "object" && img.public_id) {
                    public_id = img.public_id;
                } else if (typeof img === "string" && img.includes("cloudinary.com")) {
                    const parts = img.split("/");
                    public_id = parts[parts.length - 1].split(".")[0];
                }

                if (public_id) {
                    await cloudinary.v2.uploader.destroy(public_id);
                } else {
                    console.warn("Invalid public_id for image:", img);
                }
            }
        }

        await productModel.findByIdAndDelete(product_id);

        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Product By ID
const get_categorywise_product = async (req, res) => {
    try {
        const { product_id } = req.params;
        const product = await productModel.findById(product_id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "Product fetched",
            error: false,
            success: true,
            data: product
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

// Update Product
const update_categorywise_product = async (req, res) => {
    try {
        const {
            productCode, category, productImage, price,
            discountedPrice, isFurniture, description, color, colorName, productDimensions, careInstructions, frameMaterial, seatLength, seatHeight,seatDepth, seatCapacity,storage,
            pillowIncluded
        } = req.body;

        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.product_id,
            {
                productCode,
                category,
                slug: productCode.split('/').join('-'),
                productImage,
                price,
                discountedPrice,
                isFurniture,
                description,
                color,
                colorName,
                productDimensions,
                careInstructions,
                frameMaterial,
                seatLength,
                seatHeight,
                seatDepth,
                seatCapacity,
                storage,
                pillowIncluded
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: 'Product not found',
                error: true,
                success: false
            });
        }

        return res.json({
            message: 'Product updated successfully',
            error: false,
            success: true,
            product: updatedProduct
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

// Get Product By Category (Website)
const get_product_by_category = async (req, res) => {
    const { category } = req.params;

    try {
        const products = await productModel.find({
            category,
            status: 'active'
        }).sort({ createdAt: -1 });

        return res.status(200).json({ product: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Products by Specific Category
const get_category = async (req, res) => {
    try {
        const { getCategory } = req.body;

        const categoryProducts = await productModel.find({
            category: getCategory,
            status: 'active'
        }).sort({ createdAt: -1 }).limit(10);

        return res.status(200).json(categoryProducts);
    } catch (error) {
        console.error('Error fetching category products:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Only Furniture Products
const get_furniture_only = async (req, res) => {
    try {
        const furnitureProducts = await productModel.find({
            isFurniture: true,
            status: 'active'
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "All Furniture Products",
            success: true,
            error: false,
            data: furnitureProducts
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch furniture products' });
    }
};

// Get New Furniture Products
const get_new_products = async (req, res) => {
    try {
        const newProducts = await productModel.find({
            isFurniture: true,
            status: 'active'
        }).sort({ createdAt: -1 }).limit(8);

        return res.status(200).json(newProducts);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Home Solution API
const get_home_solution = async (req, res) => {
    const { category } = req.query;

    try {
        const data = await productModel.find({ category, status: "active" });
        return res.json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Server Error' });
    }
};

// Get Product Details by Slug
const get_products_details = async (req, res) => {
    try {
        const { productSlug } = req.body;

        const product = await productModel.findOne({ slug: productSlug });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found',
                success: false,
                error: true
            });
        }

        return res.status(200).json({
            data: product,
            message: "Product details fetched",
            success: true,
            error: false,
        });
    } catch (error) {
        return res.status(500).json({
            message: error?.message || error,
            error: true,
            success: false
        });
    }
};

// Search Products
const search_products = async (req, res) => {
    try {
        const query = req.query.q;

        if (!query) {
            return res.status(400).json({
                message: "Query parameter 'q' is required",
                error: true,
                success: false
            });
        }

        const regex = new RegExp(query, 'i');
        const product = await productModel.find({
            productCode: { $regex: regex }
        });

        return res.json({
            data: product,
            message: "Search Product List",
            error: false,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Exports
module.exports = {
    add_product,
    get_dashboard_product,
    update_product_status,
    delete_product,
    get_categorywise_product,
    update_categorywise_product,
    get_product_by_category,
    get_category,
    get_furniture_only,
    get_new_products,
    get_home_solution,
    get_products_details,
    search_products
};
