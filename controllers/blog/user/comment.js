const Comment = require('../../../Models/comment'); // Corrected model import path
const User = require('../../../Models/user');
const Blog = require('../../../Models/blog');

const createComment = async (req, res) => {
    try {
        const { blogId, comment } = req.body;
        const userId = req.user._id; 
        if (!blogId || !comment) {
            return res.status(400).json({
                status: false,
                message: 'Blog ID and comment are required.'
            });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                status: false,
                message: 'Blog not found.'
            });
        }

       

        const newComment = new Comment({
            blogId,
            blogName: blog.title,
            userId,
            username: req.user.name, 
            comment
        });

        const savedComment = await newComment.save();

        res.status(201).json({
            status: true,
            message: 'Comment created successfully.',
            data: savedComment
        });
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({
            status: false,
            error: 'Internal server error'
        });
    }
};


const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params; 
        const { comment } = req.body; 
        const userId = req.user._id; 

        console.log(`Received commentId: ${commentId}`); // Log received commentId

        // Find the comment by ID
        const existingComment = await Comment.findById(commentId);
        if (!existingComment) {
            return res.status(404).json({
                status: false,
                message: 'Comment not found.'
            });
        }

        // Check if the user is authorized to update the comment
        if (existingComment.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                status: false,
                message: 'You are not authorized to update this comment.'
            });
        }

        // Update the comment
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { comment },
            { new: true } 
        );

        res.status(200).json({
            status: true,
            message: 'Comment updated successfully.',
            data: updatedComment
        });
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({
            status: false,
            error: 'Internal server error'
        });
    }
};


const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params; 
        const userId = req.user._id; 

        if (!commentId) {
            return res.status(400).json({
                status: false,
                message: 'Comment ID is required.'
            });
        }

        const existingComment = await Comment.findById(commentId);
        if (!existingComment) {
            return res.status(404).json({
                status: false,
                message: 'Comment not found.'
            });
        }

        if (existingComment.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                status: false,
                message: 'You are not authorized to delete this comment.'
            });
        }

        const deletedComment = await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            status: true,
            message: 'Comment deleted successfully.',
            data: deletedComment
        });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({
            status: false,
            error: 'Internal server error'
        });
    }
};

module.exports = { createComment,deleteComment,updateComment };
