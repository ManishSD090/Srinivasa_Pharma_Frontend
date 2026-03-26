// src/Login/OAuthSuccess.jsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";

const OAuthSuccess = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
            console.warn("OAuth token missing");
            navigate("/", { replace: true });
            return;
        }

        // Use context login to set state correctly
        login(token);

        const userDataString = params.get("user");
        if (userDataString) {
            try {
                const parsedUser = JSON.parse(decodeURIComponent(userDataString));
                
                // 🔴 ADD THIS EXACT LINE 🔴
                // Save the parsed Google user to localStorage so your Header can read their name!
                localStorage.setItem('user', JSON.stringify(parsedUser));

                if (parsedUser.role === "admin") {
                    navigate("/admin/dashboard", { replace: true });
                } else {
                    navigate("/staff/dashboard", { replace: true });
                }
            } catch (err) {
                console.error("Failed to parse user data", err);
                navigate("/", { replace: true });
            }
        }
    }, [navigate, login]);

    return <p className="p-8 text-center text-teal-700 font-medium">Synchronizing session...</p>;
};

export default OAuthSuccess;