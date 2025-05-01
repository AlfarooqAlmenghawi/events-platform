import axios from "axios";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate(); // For redirecting after login
  const { login } = useContext(AuthContext);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const message = queryParams.get("message"); // Gets the value after ?message=

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loginUser = async (event) => {
    event.preventDefault(); // Prevent form default submission behavior

    try {
      const response = await axios.post(
        "https://events-platform-backend-production.up.railway.app/login",
        {
          email: event.target.email.value,
          password: event.target.password.value,
        }
      );
      // Assuming the response contains a token
      const token = response.data.token;

      await login(token);
      navigate("/my-events");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError(
            "It seems that your username/password isn't correct. If you are sure you entered them correctly, please verify your email before logging in."
          );
        }
        if (error.response.data.error === "Email not verified") {
          setError(
            "It seems that your email isn't verified. Please check your inbox and verify your email before logging in."
          );
        }
        console.error("Login failed:", error.response);
      } else {
        console.error("Login error:", error.message);
      }
    }
  };

  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    setAnnouncement("You are now on the Login page.");
  }, []);

  return (
    <div className="event">
      {/* Accessible live region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          left: "-9999px",
          height: "1px",
          width: "1px",
          overflow: "hidden",
        }}
      >
        {announcement}
      </div>
      <h2 className="browse-events-page-title">Login</h2>
      <form onSubmit={loginUser} aria-describedby="error-message">
        <div className="title-and-input">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="title-and-input">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>

        <div className="create-event-form-button-div">
          <button className="create-event-form-button" type="submit">
            Login
          </button>
        </div>
      </form>
      {/* Always render an error element, even if it's hidden */}
      <p
        id="error-message"
        style={{
          color: "red",
          minHeight: "1em", // Prevent page shift
          visibility: error ? "visible" : "hidden",
        }}
      >
        {error || "No errors yet."}
      </p>
      {/* Message can stay as-is */}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <p
        style={{
          textAlign: "center",
          margin: 0,
        }}
      >
        Don't have an account?{" "}
        <a href="/signup" aria-label="Sign up for a new account">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default Login;
