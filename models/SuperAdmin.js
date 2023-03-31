const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const superAdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "please enter username"]
    },
    password: {
        type: String,
        required: [true, "plaese enter password"],
        select: false
    },
    role:{
        type:String,
        default: "SuperAdmin"
    }
})

superAdminSchema.methods.matchPassword = async function (password) {
    if (password === this.password)
        return true
    return false
}

superAdminSchema.methods.generateToken = function () {
    return jwt.sign({_id:this._id},process.env.JWT_SECRET)
}

module.exports = mongoose.model("sadmins", superAdminSchema);