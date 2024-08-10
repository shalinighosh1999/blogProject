const Blog = require('../../../Models/blog');
const BlogCategory = require('../../../Models/blogcategory');
const User = require('../../../Models/user');
const Admin=require('../../../Models/admin')
const Like = require('../../../Models/like')
const mongoose=require('mongoose')
const Comment =require('../../../Models/comment')


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
            userId, 
            username
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

 


const createBlog_admin = async (req, res) => {
    try {
        const { title, description, singleImage, multipleImages, categoryId } = req.body;
        const userId = req.user._id; 

        const category = await BlogCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });
        }

        const categoryName = category.name;

        const admin = await Admin.findById(userId);
        if (!admin) {
            return res.status(404).json({
                status: false,
                message: "Admin not found"
            });
        }

        const username = admin.name; 

        const newBlog = new Blog({
            title,
            description,
            singleImage,
            multipleImages,
            categoryId,
            categoryName,
            userId, 
            username 
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






// const getAllBlogs = async (req, res) => {
//     try {
//         const blogs = await Blog.find();

//         res.status(200).json({
//             status: true,
//             data: blogs
//         });
//     } catch (error) {
//         console.error("Error fetching blog posts:", error);
//         res.status(500).json({
//             status: false,
//             error: "Internal server error"
//         });
//     }
// };


const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.aggregate([
            {
                $match: { isDeleted: false } 
            },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'blogId',
                    as: 'likes'
                }
            },
            {
                $addFields: {
                    likeCount: { $size: '$likes' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'likes.userId',
                    foreignField: '_id',
                    as: 'likeUsers'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'blogId',
                    as: 'comments'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'comments.userId',
                    foreignField: '_id',
                    as: 'commentUsers'
                }
            },
            {
                $addFields: {
                    commentCount: { $size: '$comments' }
                }
            },
            // Project the final result
            {
                $project: {
                    title: 1,
                    description: 1,
                    singleImage: 1,
                    multipleImages: 1,
                    isDeleted: 1,
                    categoryId: 1,
                    categoryName: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    likeCount: 1,
                    commentCount: 1,
                    likes: {
                        _id: 1,
                        blogId: 1,
                        userId: 1,
                        username: 1
                    },
                    likeUsers: {
                        _id: 1,
                        name: 1,
                        email: 1
                    },
                    comments: {
                        _id: 1,
                        blogId: 1,
                        userId: 1,
                        username: 1,
                        comment: 1,
                        createdAt: 1,
                        updatedAt: 1
                    },
                    commentUsers: {
                        _id: 1,
                        name: 1,
                        email: 1
                    }
                }
            }
        ]);

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






// const getBlogById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const blog = await Blog.findById(id);

//         if (!blog) {
//             return res.status(404).json({
//                 status: false,
//                 message: "Blog post not found"
//             });
//         }

//         res.status(200).json({
//             status: true,
//             data: blog
//         });
//     } catch (error) {
//         console.error("Error fetching blog post:", error);
//         res.status(500).json({
//             status: false,
//             error: "Internal server error"
//         });
//     }
// };



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

        const likes = await Like.find({ blogId: blog._id });

        const comments = await Comment.find({ blogId: blog._id });

        res.status(200).json({
            status: true,
            data: {
                ...blog.toObject(),
                likeCount: likes.length,
                likes: likes.map(like => ({
                    userId: like.userId,
                    username: like.username
                })),
                commentCount: comments.length,
                comments: comments.map(comment => ({
                    _id: comment._id,
                    userId: comment.userId,
                    username: comment.username,
                    comment: comment.comment,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt
                }))
            }
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



const deleteBlog_user = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({
                status: false,
                message: "Blog post not found"
            });
        }

        if (blog.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                status: false,
                message: "You are not authorized to delete this blog post"
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

const getBlogsByCategoryId = async (req, res) => {
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
    getBlogsByCategoryId,
    createBlog_admin,
    deleteBlog_user
};