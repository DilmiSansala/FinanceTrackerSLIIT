const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        targetAmount: {
            type: Number,
            required: true,
        },
        savedAmount: {
            type: Number,
            default: 0,
        },
        deadline: {
            type: Date,
            required: true,
        },
        progress: {
            type: Number,
            default: 0, // Progress percentage (0 to 100)
        },
        status: {
            type: String,
            enum: ["active", "completed", "failed"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Goal", goalSchema);