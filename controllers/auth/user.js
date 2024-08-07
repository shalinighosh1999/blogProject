const User=require('../../Models/user')
const bcrypt = require('bcryptjs');
const { Validator } = require('node-input-validator');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const otpGenerator = require('otp-generator')





function createToken(data) {
    return jwt.sign(data, 'DonateSmile');
}

const getTokenData = async (token) => {
    let userdata = await User.findOne({ token: token }).exec();
    // console.log('adminData', adminData);
    return userdata;
}





const userRegister = async (req, res) => {
    try {
       
        const { name, email, password ,secretQuestion, secretAnswer} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedSecretAnswer = await bcrypt.hash(secretAnswer, 10);


        const existingUser = await User.findOne({ $or: [{ name }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                status:false,
                message: "Username or email already exists" });
        }
        const newAdmin = new User({
            name,
            email,
            secretQuestion,
            actualanswer:secretAnswer,
            secretAnswer: hashedSecretAnswer,
            token: createToken(req.body),
            password: hashedPassword,
         
        });

    
        const savedAdmin = await newAdmin.save();

        res.status(201).json({
            status:true,
            data:savedAdmin}); 
    } catch (error) {
        console.error("Error registering admin:", error);
        res.status(500).json({ 
            status:false,
            error: "Internal server error" });
    }
}


// const forgotPassword=async(req,res)=>{
//     try {
//         const { email } = req.body;

//         // Validate input
//         if (!email) {
//             return res.status(400).json({
//                 status: false,
//                 message: "Email is required"
//             });
//         }

//         // Find the user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(404).json({
//                 status: false,
//                 message: "User not found"
//             });
//         }

//         // Return the secret question
//         res.status(200).json({
//             status: true,
//             secretQuestion: user.secretQuestion
//         });
//     } catch (error) {
//         console.error("Error retrieving secret question:", error);
//         res.status(500).json({
//             status: false,
//             error: "Internal server error"
//         });
//     }
// }


// const matchsecretanswer = async (req, res) => {
//     try {
//         const userId = req.user._id; // Assuming user is authenticated and userId is available
//         const { secretQuestion, secretAnswer  } = req.body;

//         // Validate input
//         if (!secretQuestion || !secretAnswer) {
//             return res.status(400).json({
//                 status: false,
//                 message: "Secret question and answer are required"
//             });
//         }

//         // Find the user by userId
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 status: false,
//                 message: "User not found"
//             });
//         }

//         // Check if the provided secret question matches the user's secret question
//         if (user.secretQuestion !== secretQuestion) {
//             return res.status(400).json({
//                 status: false,
//                 message: "Secret question does not match"
//             });
//         }

//         // Verify the secret answer
//         const isAnswerCorrect = await bcrypt.compare(secretAnswer, user.secretAnswer);
//         if (!isAnswerCorrect) {
//             return res.status(400).json({
//                 status: false,
//                 message: "Secret answer is incorrect"
//             });
//         }

//         // Proceed to reset password or other actions
//         res.status(200).json({
//             status: true,
//             message: "Secret answer matched"
//         });
//     } catch (error) {
//         console.error("Error matching secret answer:", error);
//         res.status(500).json({
//             status: false,
//             error: "Internal server error"
//         });
//     }
// };





const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({
                status: false,
                message: "Email is required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        const securityQuestions = [
            "What is the name of your first pet?",
            "What is your mother's maiden name?",
            "What was the name of your elementary school?",
            "What was the make and model of your first car?",
            "What is the name of the town where you were born?",
            "What is your favorite childhood book?",
            "What is the name of the street you grew up on?",
            "What was the name of your first teacher?",
            "What is the name of your oldest sibling?",
            "What was the name of your first boss?",
            "What is the name of your favorite movie?",
            "What was the name of your best friend in high school?",
            "What is your favorite food?",
            "What was your first phone number?",
            "What was your childhood nickname?",
            "What was the make and model of your first bike?",
            "What is the name of the hospital where you were born?",
            "What is the name of the city where you went to college?",
            "What was the name of your first pet?",
            "What is your favorite vacation spot?",
            "What is the name of the first school you attended?",
    "What is your father's middle name?",
    "What is the name of your favorite teacher?",
    "What is the name of the town where your grandparents live?",
    "What was your first job?",
    "What is your favorite book?",
    "What is the name of your best friend?",
    "What is the name of your favorite restaurant?",
    "What is your favorite hobby?",
    "What is your dream job?",
    "What is your favorite color?",
    "What was the name of your first place you lived alone?",
    "What is the name of your favorite sports team?",
    "What is your favorite holiday?",
    "What was your favorite subject in school?",
    "What is your favorite place to vacation?",
    "What was the name of your first boss?"
        ];

        const filteredQuestions = securityQuestions.filter(q => q !== user.secretQuestion);

        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };

        const shuffledQuestions = shuffleArray(filteredQuestions).slice(0, 6);

        const questionsToProvide = shuffleArray([user.secretQuestion, ...shuffledQuestions]);

        res.status(200).json({
            status: true,
            questions: questionsToProvide
        });
    } catch (error) {
        console.error("Error retrieving secret question:", error);
        res.status(500).json({
            status: false,
            error: "Internal server error"
        });
    }
};







const matchsecretanswer = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { secretQuestion, secretAnswer, newPassword } = req.body;

        if (!secretQuestion || !secretAnswer || !newPassword) {
            return res.status(400).json({
                status: false,
                message: "Secret question, answer, and new password are required"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        if (user.secretQuestion !== secretQuestion) {
            return res.status(400).json({
                status: false,
                message: "Secret question does not match"
            });
        }

        const isAnswerCorrect = await bcrypt.compare(secretAnswer, user.secretAnswer);
        if (!isAnswerCorrect) {
            return res.status(400).json({
                status: false,
                message: "Secret answer is incorrect"
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({
            status: true,
            message: "Password successfully updated",
            data:user
        });
    } catch (error) {
        console.error("Error matching secret answer:", error);
        res.status(500).json({
            status: false,
            error: "Internal server error"
        });
    }
};



const user_login = async (req, res) => {
    const v = new Validator(req.body, {
        email: 'required',
        password: 'required|minLength:4'
    });
    let matched = await v.check().then((val) => val);
    if (!matched) {
        return res.status(400).send({ status: false, error: v.errors });
    }
    try {
        const { email, password } = req.body;

        const admin = await User.findOne({ email: email });
        if (!admin) {
            return res.status(400).json({
                status:false, message: 'User not found or not verified' });
        }

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(400).json({status:false, message: 'Invalid password' });
        }

        return  res.status(201).json({
            status: true,
            message: 'User login successfull',
            data:admin

        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error',
            data: null
        });
    }
}


const changePassword_user = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Find the admin by ID
        const admin = await User.findById(req.user._id);
        if (!admin) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(400).json({
                status: false,
                message: "Current password is incorrect"
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        admin.password = hashedNewPassword;
        const updatedAdmin = await admin.save();

        res.status(200).json({
            status: true,
            data: updatedAdmin
        });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({
            status: false,
            error: "Internal server error"
        });
    }
}


const myProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({
                status: false,
                message: "User ID is required"
            });
        }

        const user = await User.findById(userId).select('-password'); 

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            status: true,
            data: user
        });
    } catch (error) {
        console.error("Error retrieving user profile:", error);
        res.status(500).json({
            status: false,
            error: "Internal server error"
        });
    }
};

module.exports={
    userRegister,user_login,changePassword_user,getTokenData,myProfile,forgotPassword,matchsecretanswer
}