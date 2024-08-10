const { type } = require('express/lib/response');
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
        type: String
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
        ref: 'BlogCategory'
    },
    categoryName: {
        type: String
    },
    userId: { 
        type: Schema.Types.ObjectId,
       // ref: 'Admin' // Change to 'Admin' if using Admin model
    },
    username: {
        type: String
    },
    isDeleted :{
        type:Boolean,
        default:false
    }
}, {
    timestamps: true
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
