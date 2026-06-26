import { Link } from "react-router-dom";
import { useAuth } from "../interview/hooks/useAuth";

const Navbar = () => {
    const { logout } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                Resume Analyzer
            </Link>

            <button
                className="logout-btn"
                onClick={logout}
            >
                Logout
            </button>
        </nav>
    );
};

export default Navbar;