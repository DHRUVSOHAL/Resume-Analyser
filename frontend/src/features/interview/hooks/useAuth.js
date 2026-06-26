import { useNavigate } from "react-router";
import { logoutUser } from "../services/interview.api"; // or auth.api

export const useAuth = () => {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await logoutUser();

            // optional: clear any localStorage if you use it
            localStorage.clear();

            navigate("/login");
        } catch (err) {
            console.error(err);
        }
    };

    return {
        logout,
    };
};