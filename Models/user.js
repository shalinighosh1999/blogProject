// const { type } = require('express/lib/response');
// const mongoose = require('mongoose');

// const Schema = mongoose.Schema

// const userSchema = new Schema({

//     // username: {
//     //     type: String,

//     //     unique: true
//     // },

//     firstName: {
//         type: String,
//         required: true
//     },
//     lastName: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     faceId: {
//         type: String
//     },

//     token: {
//         type: String,
//         required: false,
//         unique: true,
//     },
//     profileimage: {
//         type: String,
//     },
//     status: {
//         type: String,
//         enum: ['loggedIn', 'loggedOut'],
//         default: 'loggedOut' // Set default status as 'loggedOut'
//     },
//     logintime: {
//         type: Date
//     },
//     logOutTime: {
//         type: Date
//     },




//     loginlocationName: {
//         type: String
//     },
//     logoutlocationName: {
//         type: String
//     },


//     logoutLocation: {
//         longitude: {
//             type: Number,
//             default: null
//         },
//         latitude: {
//             type: Number,
//             default: null
//         }
//     },
//     loginLocation: {
//         longitude: {
//             type: Number,
//             default: null
//         },
//         latitude: {
//             type: Number,
//             default: null
//         }
//     },
//     isDeleted: {
//         type: Boolean,
//         default: false
//     },
//     checkinStatus: {
//         type: String,
//         enum: ['checkedIn', 'checkedOut'],
//         default: 'checkedOut' // Set default status as 'loggedOut'
//     },

// },
//     {
//         timestamps: true
//     });


// const User = mongoose.model('User', userSchema);

// module.exports = User;


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    faceId: {
        type: String
    },
    token: {
        type: String,
        required: false,
        unique: true
    },
    profileimage: {
        type: String
    },
    status: {
        type: String,
        enum: ['loggedIn', 'loggedOut'],
        default: 'loggedOut'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    checkinStatus: {
        type: String,
        enum: ['checkedIn', 'checkedOut'],
        default: 'checkedOut'
    },
    loginInfo: [{
        logintime: {
            type: Date,
            required: true
        },
        loginlocationName: {
            type: String
        },
        loginLocation: {
            longitude: {
                type: Number,
                default: null
            },
            latitude: {
                type: Number,
                default: null
            }
        },
        status:{
            type:String,
            default:"checkedIn"
        }
    }],
    logoutInfo: [{
        logOutTime: {
            type: Date,
            required: true
        },
        logoutlocationName: {
            type: String
        },
        logoutLocation: {
            longitude: {
                type: Number,
                default: null
            },
            latitude: {
                type: Number,
                default: null
            }
        }
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
