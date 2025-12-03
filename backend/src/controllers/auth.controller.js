import jwt from "jsonwebtoken";

export const authSuccess = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({
        message: "Login successful",
        user: req.user,
        token,
    });
};

export const logoutUser = (req, res) => {
    req.logout(() => {
        res.json({ message: "Logged out successfully" });
    });
};
