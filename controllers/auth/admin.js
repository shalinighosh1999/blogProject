const Admin=require('../../Models/admin')
const bcrypt = require('bcryptjs');
const { Validator } = require('node-input-validator');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const otpGenerator = require('otp-generator')
const User=require('../../Models/user')



function createToken(data) {
    return jwt.sign(data, 'DonateSmile');
}

const getTokenData = async (token) => {
    let admindata = await Admin.findOne({ token: token }).exec();
    // console.log('adminData', adminData);
    return admindata;
}

const test = async (req, res) => {
    try {
        const data = "hello";
        res.status(200).json({ message: data });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}


const adminRegister = async (req, res) => {
    try {
       
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await Admin.findOne({ $or: [{ name }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                status:false,
                message: "Username or email already exists" });
        }
        const newAdmin = new Admin({
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





const admin_login = async (req, res) => {
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

        const admin = await Admin.findOne({ email: email });
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
            message: 'admin login successfull',
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


const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Find the admin by ID
        const admin = await Admin.findById(req.user._id);
        if (!admin) {
            return res.status(404).json({
                status: false,
                message: "Admin not found"
            });
        }

        // Check if the current password is correct
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(400).json({
                status: false,
                message: "Current password is incorrect"
            });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the admin's password
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

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                status: false,
                message: "User ID is required"
            });
        }

       

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        user.isDeleted = true;
        await user.save();

        res.status(200).json({
            status: true,
            message: "User successfully marked as deleted"
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            status: false,
            error: "Internal server error"
        });
    }
};




const S3 = require('../../service/s3');
 

const imageUpload = async (req, res) => {
    let uploadDAta = await S3.doUpload(req, "admin/profile/" + req.user._id);
    if (uploadDAta.status) {
        res.send(uploadDAta);
    } else {
        res.send(uploadDAta);
    }
}


module.exports={
    getTokenData,
    adminRegister,
    test,
    admin_login,
    changePassword,
    deleteUser,
    imageUpload
}