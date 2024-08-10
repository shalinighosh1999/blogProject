const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
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
       // required: true
    },
    username: {
        type: String
    }
}, {
    timestamps: true
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
