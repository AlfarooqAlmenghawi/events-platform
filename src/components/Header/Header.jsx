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
      <h1>Events Platform</h1>
      <section className="header-buttons">
        <Link to="/browse-events">
          <button>Browse Events</button>
        </Link>
        <Link to="/my-events">
          <button>My Events</button>
        </Link>
        {user ? (
          <>
            <span>Welcome, {user.first_name + " " + user.last_name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/signup">
              <button>Sign Up</button>
            </Link>
          </>
        )}
      </section>
    </header>
  );
};

export default Header;
