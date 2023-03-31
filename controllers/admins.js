const Admins = require("../models/Admins");
const { sendEmail } = require("../middlewares/sendEmail");
const crypto = require("crypto");

exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admins.findOne({ username }).select("+password");

        if (!admin) {
            return res.status(400).json({
                success: false,
                message: "admin does not exist"
            })
        }

        const isMatch = await admin.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "incorrect password"
            })
        }

        const token = await admin.generateToken();

        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        res.status(200).cookie("token", token, options).json({
            success: true,
            admin,
            token
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.adminLogout = async (req, res) => {
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

exports.resetAdminPassword = async (req, res) => {

    try {
        const admin = await Admins.findById(req.admin._id).select("+password");

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "please provide old password and new password"
            })
        }

        const isMatch = await admin.matchPassword(oldPassword);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "incorrect old password"
            })
        }

        admin.password = newPassword;
        await admin.save();

        res.status(200).json({
            success: true,
            message: "password updated"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


exports.forgetAdminPassword = async (req, res) => {
    try {
        const admin = await Admins.findOne({ username: req.body.username });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not exist"
            })
        }

        const resetPasswordToken = admin.getResetPasswordToken();

        await admin.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetPasswordToken}`;

        const message = `Reset your password by clicking on the link below : \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: admin.username,
                subject: "Reset Password",
                message
            })

            res.status(200).json({
                success: true,
                message: `Email sent to ${admin.username}`
            })

        } catch (error) {
            admin.resetPasswordToken = undefined;
            admin.resetPasswordExpire = undefined;
            await admin.save();

            res.status(500).json({
                success: false,
                message: error.message
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


exports.resetAdminForgetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const admin = await Admins.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        })

        if (!admin) {
            res.status(401).json({
                success: false,
                message: "Token is invalid or has expired"
            })
        }

        admin.password = req.body.password;

        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpire = undefined;
        await admin.save();

        res.status(200).json({
            success: true,
            message: "password updated"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}