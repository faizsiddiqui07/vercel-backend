const { default: mongoose } = require('mongoose');
const userModel = require('../models/userModel')
const userSubscribeModel = require('../models/userSubscribeModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSignUp = async (req, res) => {
    const { email, password, cPassword, firstName, lastName, gender, phone, DOB, address, city, state, pinCode } = req.body;

    // Validation checks for all fields
    if (!email) return res.status(400).json({ message: 'Please Enter your email' });
    if (!password) return res.status(400).json({ message: 'Please Enter your password' });
    if (password !== cPassword) return res.status(400).json({ message: 'Passwords do not match' });
    if (!firstName || !lastName) return res.status(400).json({ message: 'Please Enter your first and last name' });
    if (!gender) return res.status(400).json({ message: 'Please Enter your gender' });
    if (!phone) return res.status(400).json({ message: 'Please Enter your phone number' });
    if (!DOB) return res.status(400).json({ message: 'Please Enter your date of birth' });
    if (!address || !city || !state || !pinCode) return res.status(400).json({ message: 'Please Enter your full address' });

    try {
        // Check if user already exists
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(409).json({ message: 'User Already Exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user instance
        const newUser = new userModel({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            gender,
            phone,
            DOB,
            address,
            city,
            state,
            pinCode,
        });

        // Save the user
        const saveUser = await newUser.save();

        // Sign JWT token
        const token = await jwt.sign({ id: saveUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        // Send response
        res.status(201).json({
            user: saveUser,
            token: token,
            success: true,
            message: 'User Created Successfully'
        });

    } catch (error) {
        console.error('Error during user sign-up:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const userLogin = async (req, res) => {

    const { email, password } = req.body;

    // Validation for empty fields
    if (!email) {
        return res.status(400).json({ message: 'Please provide your email' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Please provide your password' });
    }

    try {
        // Check if user exists
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if password matches
        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Construct token data
        const tokenData = {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            phone: user.phone,
            DOB: user.DOB,
            address: user.address,
            city: user.city,
            state: user.state,
            pinCode: user.pinCode
        };

        // Generate JWT token
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        // Set token options
        const tokenOptions = {
            httpOnly: true,
            secure: true,  // Ensure HTTPS is being used in production
        };

        res.cookie("token", token, tokenOptions).json({
            message: "Login Successful",
            data: tokenData,
            token: token,
            success: true,
            error: false,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const userDetails = async (req, res) => {

    try {
        const user = await userModel.findById(req.userId)

        res.status(200).json({
            data: user,
            error: false,
            success: true,
            message: "User details"
        })

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

const userLogout = async (req, res) => {
    try {
        res.clearCookie("token")

        res.json({
            message: "Logged out successfully",
            error: false,
            success: true,
            data: []
        })
    } catch (error) {
        res.json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

const userSubscribe = async (req, res) => {

    try {
        const { email, phone } = req.body;

        // Check if either email or phone already exists
        const existingUser = await userSubscribeModel.findOne({
            $or: [{ email }, { phone }]
        });


        if (existingUser) {
            const message = existingUser.email === email
                ? 'Email already exists'
                : 'Phone number already exists';
            return res.status(400).json({ message });
        }

        // Create and save new subscription
        const newSubscribe = new userSubscribeModel({ email, phone });
        const savedUser = await newSubscribe.save();

        res.status(200).json({
            savedUser,
            success: true,
            message: "Subscription Successful"
        });

    } catch (error) {
        console.error("Subscription error:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const updateUser = async (req, res) => {
    
    const { userId } = req.params;
    

    const { email, firstName, lastName, gender, phone, DOB, address, city, state, pinCode } = req.body;

    try {
        // Check if the user ID is valid
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Find the user by ID
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's details if provided
        user.firstName = firstName || user.firstName; 
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.gender = gender || user.gender;
        user.DOB = DOB || user.DOB;
        user.address = address || user.address;
        user.city = city || user.city;
        user.state = state || user.state;
        user.pinCode = pinCode || user.pinCode;

        // Save the updated user details
        await user.save();

        res.status(200).json({
            success: true,
            error: false,
            message: "Profile updated successfully",
            user
        });

    } catch (error) {
        console.error("Error updating user:", error); // Log the error for debugging purposes
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}; 






module.exports = {
    userSignUp,
    userLogin,
    userDetails,
    userLogout,
    userSubscribe,
    updateUser
}
