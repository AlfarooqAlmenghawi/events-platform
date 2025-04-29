import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./Header.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {}, [user]);

  return (
    <header className="header">
      <img src="/assets/logo.png" alt="Events Platform Logo" className="logo" />

      <section className="header-buttons">
        {user ? (
          <>
            <Link
              to="/browse-events"
              className="header-button"
              aria-label="Go to browse events page"
            >
              Browse Events
            </Link>
            <Link
              to="/my-events"
              className="header-button"
              aria-label="Go to my events page"
            >
              My Events
            </Link>
            <span className="welcome-message">
              Welcome, {user.first_name + " " + user.last_name}
            </span>
            <button onClick={logout} className="header-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/browse-events"
              className="header-button"
              aria-label="Go to browse events page"
            >
              Browse Events
            </Link>
            <Link
              to="/login"
              className="header-button"
              aria-label="Go to login page"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="header-button"
              aria-label="Go to sign up page"
            >
              Sign Up
            </Link>
          </>
        )}
      </section>

      <button
        className="open-menu-button-phone"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? "Close Menu" : "Open Menu"}
      </button>

      {menuOpen && (
        <section className="header-buttons-phone">
          {user ? (
            <>
              <span className="welcome-message-phone">
                Welcome, {user.first_name + " " + user.last_name}
              </span>
              <Link
                to="/browse-events"
                className="header-button-phone"
                aria-label="Go to browse events page"
              >
                Browse Events
              </Link>
              <Link
                to="/my-events"
                className="header-button-phone"
                aria-label="Go to my events page"
              >
                My Events
              </Link>
              <button
                onClick={logout}
                className="header-button-phone"
                aria-label="Log out of your account"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/browse-events"
                className="header-button-phone"
                aria-label="Go to browse events page"
              >
                Browse Events
              </Link>
              <Link
                to="/login"
                className="header-button-phone"
                aria-label="Go to login page"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="header-button-phone"
                aria-label="Go to sign up page"
              >
                Sign Up
              </Link>
            </>
          )}
        </section>
      )}
    </header>
  );
};

export default Header;
