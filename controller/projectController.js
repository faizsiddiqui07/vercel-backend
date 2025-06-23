const moment = require('moment');
const cloudinary = require("cloudinary");
const projectModel = require('../models/projectModel');

// Add New Project
const add_project = async (req, res) => {

    try {
        const { projectName, bookingAmount, ownershipPlan, unitBreakdown } = req.body;

        if (!projectName || !bookingAmount || !ownershipPlan || !unitBreakdown) {
            return res.json({
                message: 'Required fields are missing',
                error: true,
                success: false
            });
        }

        const slug = projectName.split(' ').join('-');
        const newProject = new projectModel({
            ...req.body,
            slug,
            date: moment().format('LL'),
        });

        const savedProject = await newProject.save();

        return res.status(201).json({
            message: "Project created successfully",
            error: false,
            success: true,
            data: savedProject
        });
    } catch (error) {
        console.error('Error uploading project:', error);
        return res.status(400).json({
            message: 'Error uploading project',
            error: true,
            success: false
        });
    }
};

// Dashboard - Get All Projects
const get_dashboard_project = async (req, res) => {
    try {
        const allProjects = await projectModel.find().sort({ createdAt: -1 });
        return res.status(200).json({
            message: "All Projects",
            success: true,
            error: false,
            data: allProjects
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

// Update Project Status
const update_project_status = async (req, res) => {
    try {
        const { project_id } = req.params;
        const { status } = req.body;

        const updatedStatus = await projectModel.findByIdAndUpdate(
            project_id,
            { status },
            { new: true }
        );

        return res.status(200).json({
            message: 'Project status updated successfully',
            updatedStatus
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error updating project status',
            error: true
        });
    }
};

// Delete Project and Images from Cloudinary
const delete_project = async (req, res) => {
    const { project_id } = req.params;

    try {
        const project = await projectModel.findById(project_id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (Array.isArray(project.projectImages)) {
            for (const img of project.projectImages) {
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

        await projectModel.findByIdAndDelete(project_id);

        return res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Get Project By ID
const get_categorywise_project = async (req, res) => {

    try {
        const { project_id } = req.params;

        const project = await projectModel.findById(project_id);

        if (!project) {
            return res.status(404).json({
                message: 'Project not found',
                error: true,
                success: false
            });
        }

        return res.status(200).json({
            message: "Project fetched",
            error: false,
            success: true,
            data: project
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};

// Update Project
const update_categorywise_project = async (req, res) => {
    try {
        const {
            projectName,
            projectAddress,
            projectImages,
            projectOverview,
            landArea,
            builtUpArea,
            functionality,
            amenities,
            targetIRR,
            peRatio,
            possessionStatus,
            targetRentalYield,
            projectAmount,
            bookingAmount,
            ownershipPlan,
            unitBreakdown,
            projectStatus,
            description,
        } = req.body;

        const updatedProject = await projectModel.findByIdAndUpdate(
            req.params.project_id,
            {
                projectName,
                projectAddress,
                slug: projectName.split(' ').join('-'),
                projectImages,
                projectOverview,
                landArea,
                builtUpArea,
                functionality,
                amenities,
                targetIRR,
                peRatio,
                possessionStatus,
                targetRentalYield,
                projectAmount,
                bookingAmount,
                ownershipPlan,
                unitBreakdown,
                projectStatus,
                description,
            },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({
                message: 'Project not found',
                error: true,
                success: false
            });
        }

        return res.json({
            message: 'Project updated successfully',
            error: false,
            success: true,
            product: updatedProject
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            error: true,
            success: false
        });
    }
};
 


// Get Project By Category (Website)
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

// Get Project by Specific Category
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

// Get Only Furniture Project
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

// Get New Furniture Project
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

// Get Project Details by Slug
const get_project_details = async (req, res) => {
    try {
        const { projectSlug } = req.body;

        const project = await projectModel.findOne({ slug: projectSlug });

        if (!project) {
            return res.status(404).json({
                message: 'Project not found',
                success: false,
                error: true
            });
        }

        return res.status(200).json({
            data: project,
            message: "Project details fetched",
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

// Search Project
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
    add_project,
    get_dashboard_project,
    update_project_status,
    delete_project,
    get_categorywise_project,
    update_categorywise_project,
    get_product_by_category,
    get_category,
    get_furniture_only,
    get_new_products,
    get_home_solution,
    get_project_details,
    search_products
};
