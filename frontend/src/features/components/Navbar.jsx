import { Link } from "react-router-dom";
import { useAuth } from "../interview/hooks/useAuth";
import "../../style/navbar.scss";

const Navbar = () => {
    const { logout } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/" className="navbar__logo">
                Resume Analyzer
            </Link>

            <div className="navbar__actions">
                <button className="logout-btn" onClick={logout}>
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;