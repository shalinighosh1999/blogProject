const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const Schema = mongoose.Schema


const adminSchema = new Schema({
    name: {
        type: String,
       
    },
    email: {
        type: String,
    },
    password: {
        type: String,
      
    },
    token: {
        type: String 
    },
   
    status:{
        type:String,
        default:"active"
    }
}, {
    timestamps: true
});


const adminmodel= mongoose.model('admin',adminSchema)
module.exports=adminmodel