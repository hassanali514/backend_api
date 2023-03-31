const SuperAdmin = require("../models/SuperAdmin");
const Admin = require("../models/Admins");
const jwt = require("jsonwebtoken");
const sadmin = "SuperAdmin";
const admin = "Admin";

exports.isSuperAdminLogin = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                message: "please login first"
            })
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET)

        req.superAdmin = await SuperAdmin.findById(decoded._id);

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

exports.isAdminLogin = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                message: "please login first"
            })
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET)

        req.admin = await Admin.findById(decoded._id);

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

exports.isSuperAdmin = async (req, res, next) => {
    try {

        if(req.superAdmin.role === sadmin){
            next();
        }else{
            return res.status(401).json({
                message: "incorrect user"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.isAdmin = async (req, res, next) => {
    try {

        if(req.admin.role === admin){
            next();
        }else{
            return res.status(401).json({
                message: "incorrect user"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
