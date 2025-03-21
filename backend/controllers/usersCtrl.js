const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const usersController = {
    // Register
    register: asyncHandler(async (req, res) => {
        const { username, email, password } = req.body;

        // Validate
        if (!username || !email || !password) {
            res.status(400);
            throw new Error("Please all fields are required");
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }

        // Hash the user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user and save into db
        const userCreated = await User.create({
            email,
            username,
            password: hashedPassword,
        });

        // Send the response
        res.status(201).json({
            username: userCreated.username,
            email: userCreated.email,
            id: userCreated._id,
        });
    }),

    // Login
    login: asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        // Check if email is valid
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400);
            throw new Error("Invalid login credentials");
        }

        // Compare the user password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400);
            throw new Error("Invalid login credentials");
        }

        // Generate a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        // Send the response
        res.status(200).json({
            message: "Login Success",
            token,
            id: user._id,
            email: user.email,
            username: user.username,
        });
    }),

    // Profile
    profile: asyncHandler(async (req, res) => {
        const user = await User.findById(req.user);
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        // Send the response
        res.status(200).json({ username: user.username, email: user.email });
    }),

    // Change password
    changeUserPassword: asyncHandler(async (req, res) => {
        const { newPassword } = req.body;

        // Find the user
        const user = await User.findById(req.user);
        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        // Hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;

        // ReSave
        await user.save({
            validateBeforeSave: false,
        });

        // Send the response
        res.status(200).json({ message: "Password Changed successfully" });
    }),

    // Update user profile
    updateUserProfile: asyncHandler(async (req, res) => {
        const { email, username } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user,
            {
                username,
                email,
            },
            {
                new: true,
            }
        );

        res.status(200).json({ message: "User profile updated successfully", updatedUser });
    }),
};

module.exports = usersController;