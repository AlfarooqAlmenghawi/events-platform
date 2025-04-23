import { Link, redirect } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import "./Header.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {}, [user]);

  return (
    <header className="header">
      <img src="/assets/logo.png" alt="Events Platform Logo" className="logo" />
      {/* <h1>Events Platform</h1> */}
      <section className="header-buttons">
        <Link to="/browse-events">
          <button className="header-button">Browse Events</button>
        </Link>
        <Link to="/my-events">
          <button className="header-button">My Events</button>
        </Link>
        {user ? (
          <>
            <span className="welcome-message">
              Welcome, {user.first_name + " " + user.last_name}
            </span>
            <button onClick={logout} className="header-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="header-button">Login</button>
            </Link>
            <Link to="/signup">
              <button className="header-button">Sign Up</button>
            </Link>
          </>
        )}
      </section>
    </header>
  );
};

export default Header;
