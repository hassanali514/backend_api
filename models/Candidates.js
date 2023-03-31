const mongoose = require("mongoose");
// const moment=require("moment");

const candidatesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter candidate's name"]
    },
    fatherName: {
        type: String,
        required: [true, "please enter candidate's father name"]
    },
    passportNo: {
        type: String,
        required: [true, "please enter candidate's passport number"]
    },
    dateOfBirth: {
        type: String,
        required: [true, "please enter candidate's date of birth"]
    },
    passportExpiryDate: {
        type: String,
        required: [true, "please enter candidate's passport expiry date"]
    },
    nationality: {
        type: String,
        required: [true, "please provide candidate's nationality"]
    },
    trade: {
        type: String,
        required: [true, "please enter candidate's trade"]
    },
    careOf: {
        type: String,
        required: [true, "please enter care of name"]
    },
    status: {
        type: String,
        required: [true, "please enter status"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Admins"
    }
})

module.exports = mongoose.model("candidates",candidatesSchema);