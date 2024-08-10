const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogCategorySchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
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
