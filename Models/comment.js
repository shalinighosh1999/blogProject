const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog', 
        required: true
    },
    blogName: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    username: {
        type: String
    },
    comment:{
        type:String
    }
}, {
    timestamps: true
});

const commentmodel = mongoose.model('comment', commentSchema);

module.exports = commentmodel;
