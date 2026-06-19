import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav style={{ padding: "15px", background: "#2c3e50" }}>
            <Link to="/" style={{ color: "white", marginRight: "15px" }}>Home</Link>
            <Link to="/resources" style={{ color: "white", marginRight: "15px" }}>Resources</Link>
            <Link to="/about" style={{ color: "white", marginRight: "15px" }}>About</Link>
            <Link to="/contact" style={{ color: "white", marginRight: "15px" }}>Contact</Link>
            <Link to="/login" style={{ color: "white", marginRight: "15px" }}>Login</Link>
            <Link to="/register" style={{ color: "white" }}>Register</Link>
        </nav>
    );
}

export default Navbar;