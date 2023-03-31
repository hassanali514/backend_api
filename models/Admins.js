const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const adminsShema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "please enter username"]
    },
    password: {
        type: String,
        required: [true, "plaese enter password"],
        select: false
    },
    role: {
        type: String,
        default: "Admin"
    },
    record: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Candidates"
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

adminsShema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

adminsShema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

adminsShema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET)
}

adminsShema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    console.log(resetToken);
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 5 * 60 * 1000; // 2 minutes
    return resetToken;
}

module.exports = mongoose.model("admins", adminsShema);