const BlogCategory = require('../../../Models/blogcategory');

const createBlogCategory = async (req, res) => {
    try {
        const { name, image, description } = req.body;

        const newCategory = new BlogCategory({
            name,
            image,
            description
        });

        const savedCategory = await newCategory.save();

        res.status(201).json({
            status: true,
            data: savedCategory
        });
    } catch (error) {
        console.error("Error creating blog category:", error);
        res.status(500).json({
            status: false,
            error: "Internal server error"
        });
    }
};

const getAllBlogCategories = async (req, res) => {
    try {
        const categories = await BlogCategory.find();

        res.status(200).json({
            status: true,
            data: categories
        });
    } catch (error) {
        console.error("Error fetching blog categories:", error);
        res.status(500).json({
            status: false,
            error: "Internal server error"
        });
    }
};

const updateBlogCategory = async (req, res) => {
    try {
        const { id } = req.params; 
        const { name, image, description } = req.body;

        const updatedCategory = await BlogCategory.findByIdAndUpdate(
            id,
            { name, image, description },
            { new: true, runValidators: true } 
        );

        if (!updatedCategory) {
            return res.status(404).json({
                status: false,
                message: "Blog category not found"
            });
        }

        res.status(200).json({
            status: true,
            data: updatedCategory
        });
    } catch (error) {
        console.error("Error updating blog category:", error);
        res.status(500).json({
            status: false,
            error: "Internal server error"
        });
    }
};

const deleteBlogCategory = async (req, res) => {
    try {
        const { id } = req.params; 

        const deletedCategory = await BlogCategory.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({
                status: false,
                message: "Blog category not found"
            });
        }

        res.status(200).json({
            status: true,
            message: "Blog category deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting blog category:", error);
        res.status(500).json({
            status: false,
            error: "Internal server error"
        });
    }
};

module.exports = {
    createBlogCategory,
    getAllBlogCategories,
    updateBlogCategory,
    deleteBlogCategory
};
