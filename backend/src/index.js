import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import app from "./app.js";

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("🟢 MongoDB Connected"))
    .catch((err) => console.log("❌ Mongo Error:", err));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
