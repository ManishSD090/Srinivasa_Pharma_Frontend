import express from "express";
import session from "express-session";
import passport from "./config/passport.js";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// base routes
app.use("/api/auth", authRoutes);

export default app;
