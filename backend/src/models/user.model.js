import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        googleId: { type: String, required: true },
        name: String,
        email: String,
        avatar: String,
    },
    { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
