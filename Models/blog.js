const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    singleImage: {
        type: String, 
    },
    multipleImages: [{
        type: String 
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'BlogCategory', 
    },
    categoryName: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    username: {
        type: String,
        required: true
    }
}, {
    timestamps: true 
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
