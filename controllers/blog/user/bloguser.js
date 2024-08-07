const Blog = require('../../../Models/blog');
const BlogCategory = require('../../../Models/blogcategory');
const User = require('../../../Models/user');


const createBlog = async (req, res) => {
    try {
        const { title, description, singleImage, multipleImages, categoryId } = req.body;
        const userId = req.user._id; // Use the userId from req.user._id

        const category = await BlogCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });
        }

        const categoryName = category.name;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        const username = user.name; 

        const newBlog = new Blog({
            title,
            description,
            singleImage,
            multipleImages,
            categoryId,
            categoryName,
            createdByUserId: userId,
            createdByUsername: username
        });

        const savedBlog = await newBlog.save();

        res.status(201).json({
            status: true,
            data: savedBlog
        });
    } catch (error) {
        console.error("Error creating blog post:", error);
        res.status(500).json({
            status: false,
            error: "Internal server error"
        });
    }
};


const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();

        res.status(200).json({
            status: true,
            data: blogs
        });
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        res.status(500).json({
            status: false,
            error: "Internal server error"
        });
    }
};

const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                status: false,
                message: "Blog post not found"
            });
        }

        res.status(200).json({
            status: true,
            data: blog
        });
    } catch (error) {
        console.error("Error fetching blog post:", error);
        res.status(500).json({
            status: false,
            error: "Internal server error"
        });
    }
};


const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, singleImage, multipleImages, userId, username, categoryId, categoryName } = req.body;

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { title, description, singleImage, multipleImages, userId, username, categoryId, categoryName },
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({
                status: false,
                message: "Blog post not found"
            });
        }

        res.status(200).json({
            status: true,
            data: updatedBlog
        });
    } catch (error) {
        console.error("Error updating blog post:", error);
        res.status(500).json({
            status: false,
            error: "Internal server error"
        });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({
                status: false,
                message: "Blog post not found"
            });
        }

        blog.isDeleted = true;
        await blog.save();

        res.status(200).json({
            status: true,
            message: "Blog post marked as deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting blog post:", error);
        res.status(500).json({
            status: false,
            error: "Internal server error"
        });
    }
};

const getBlogsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.body; 

        if (!categoryId) {
            return res.status(400).json({
                status: false,
                message: "Category ID is required"
            });
        }

        const blogs = await Blog.find({ categoryId, isDeleted: false }); 
        res.status(200).json({
            status: true,
            data: blogs
        });
    } catch (error) {
        console.error("Error retrieving blogs by category:", error);
        res.status(500).json({
            status: false,
            error: "Internal server error"
        });
    }
};

const getBlogsByBlogId = async (req, res) => {
    try {
        const { blogId } = req.body; 

        if (!blogId) {
            return res.status(400).json({
                status: false,
                message: "Blog ID is required"
            });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                status: false,
                message: "Blog not found"
            });
        }

        const blogs = await Blog.find({ 
            categoryId: blog.categoryId, 
            _id: { $ne: blogId }, 
            isDeleted: false 
        });

        res.status(200).json({
            status: true,
            data: blogs
        });
    } catch (error) {
        console.error("Error retrieving blogs by blog ID:", error);
        res.status(500).json({
            status: false,
            error: "Internal server error"
        });
    }
};



module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    getBlogsByCategory,
    getBlogsByBlogId
};