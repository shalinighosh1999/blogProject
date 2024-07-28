const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogCategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String, 
        default: null
    },
    description: {
        type: String
    }
}, {
    timestamps: true 
});

const BlogCategory = mongoose.model('BlogCategory', blogCategorySchema);

module.exports = BlogCategory;
