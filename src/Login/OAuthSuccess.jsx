import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        console.log(params);

        const token = params.get("token");
        const user = params.get("user");

        if (!token || !user) {
            navigate("/");
            return;
        }

        const parsedUser = JSON.parse(decodeURIComponent(user));

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(parsedUser));

        if (parsedUser.role === "admin") {
            navigate("/admin/dashboard");
        } else {
            navigate("/staff/dashboard");
        }
    }, [navigate]);

    return <p>Logging you in...</p>;
};

export default OAuthSuccess;
