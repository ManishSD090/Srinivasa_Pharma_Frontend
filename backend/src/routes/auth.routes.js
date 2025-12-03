import { Router } from "express";
import passport from "passport";
import { authSuccess, logoutUser } from "../controllers/auth.controller.js";

const router = Router();

// Start Google Login
router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google Callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login-failed" }),
    authSuccess
);

router.get("/logout", logoutUser);

export default router;
