const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: String,
    image: String,
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures email is unique
    },
    password: {
        type: String,
    },
    gender: {
        type: String,
    },
    phone: {
        type: Number,
        unique:true
    },
    DOB: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    pinCode: {
        type: Number,
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("user", userSchema);
