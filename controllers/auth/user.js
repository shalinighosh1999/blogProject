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
       
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await User.findOne({ $or: [{ name }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                status:false,
                message: "Username or email already exists" });
        }
        const newAdmin = new User({
            name,
            email,
            
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


module.exports={
    userRegister,user_login,changePassword_user,getTokenData
}