import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
    const navigate = useNavigate();
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const params = new URLSearchParams(window.location.search);

        const token = params.get("token");
        const user = params.get("user");

        if (!token || !user) {
            console.warn("OAuth callback already handled or missing params");
            return;
        }

        let parsedUser;
        try {
            parsedUser = JSON.parse(decodeURIComponent(user));
        } catch (err) {
            console.error("Failed to parse user:", err);
            return;
        }

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(parsedUser));

        if (parsedUser.role === "admin") {
            navigate("/admin/dashboard", { replace: true });
        } else {
            navigate("/staff/dashboard", { replace: true });
        }
    }, [navigate]);

    return <p>Logging you in...</p>;
};

export default OAuthSuccess;
