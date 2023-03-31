const SuperAdmin = require('../models/SuperAdmin');
const Admins = require("../models/Admins");
const Candidate = require("../models/Candidates");

exports.registerAdmins = async (req, res) => {
    try {
        const { username, password } = req.body;
        let admin = await Admins.findOne({ username });
        if (admin) {
            return res.status(400).json({
                success: false,
                message: "Admin already exist"
            })
        }

        admin = await Admins.create({
            username,
            password
        })

        res.status(201).json({
            success: true,
            admin
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admins.find({});
        res.status(200).json({
            success: true,
            admins,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getSingleAdmin = async (req, res) => {
    try {
        const admin = await Admins.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            })
        }

        res.status(200).json({
            success: true,
            admin
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.superAdminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const sadmin = await SuperAdmin.findOne({ username }).select("+password");

        if (!sadmin) {
            return res.status(400).json({
                success: false,
                message: "admin does not exist"
            })
        }

        const isMatch = await sadmin.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "incorrect password"
            })
        }

        const token = await sadmin.generateToken();

        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            
        }

        res.status(200).cookie("token", token, options).json({
            success: true,
            sadmin,
            token,
            message:"login successfully"
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.superAdminProfile = async (req,res) => {
    try {
        const sadmin = await SuperAdmin.findById(req.superAdmin._id);

        res.status(200).json({
            success:true,
            sadmin
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.superAdminLogout = async (req, res) => {
    try {

        const options = {
            expires: new Date(Date.now()),
            httpOnly: true
        }

        res.status(200).cookie("token", null, options).json({
            success: true,
            message: "logged out"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.deleteAdmin = async (req, res) => {

    try {

        const admin = await Admins.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "admin not found"
            })
        }

        await Candidate.deleteMany({ owner: admin._id });

        await Admins.deleteOne({ _id: admin._id });

        res.status(200).json({
            success: true,
            message: "admin deleted"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }


}