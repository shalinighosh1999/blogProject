const Like = require('../../../Models/like');
const User = require('../../../Models/user');
const Blog = require('../../../Models/blog');

// const createbloglike = async (req, res) => {
//     try {
//         const { blogId } = req.body;
//         const userId = req.user._id;

//         if (!blogId || !userId) {
//             return res.status(400).json({ message: 'Blog ID and User ID are required.' });
//         }

//         const blog = await Blog.findById(blogId);
//         if (!blog) {
//             return res.status(404).json({ message: 'Blog not found.' });
//         }

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         const newLike = new Like({
//             blogId,
//             blogName: blog.title,  
//             userId,
//             username: user.name 
//         });

//         await newLike.save();

//         res.status(201).json({ message: 'Like created successfully.', like: newLike });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'An error occurred while creating the like.' });
//     }
// };


const createbloglike = async (req, res) => {
    try {
        const { blogId } = req.body;
        const userId = req.user._id;

        if (!blogId || !userId) {
            return res.status(400).json({ message: 'Blog ID and User ID are required.' });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const existingLike = await Like.findOne({ blogId, userId });

        if (existingLike) {
            await Like.deleteOne({ _id: existingLike._id });
            return res.status(200).json({ message: 'Like removed successfully.' });
        } else {
            const newLike = new Like({
                blogId,
                blogName: blog.title,  
                userId,
                username: user.name 
            });

            await newLike.save();
            return res.status(201).json({ message: 'Like created successfully.', like: newLike });
        }
    } catch (error) {
        console.error("Error handling like:", error);
        res.status(500).json({ message: 'An error occurred while processing the like.' });
    }
};

module.exports = {createbloglike};
