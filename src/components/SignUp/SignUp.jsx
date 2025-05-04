import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate(); // For redirecting after login

  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);

  const signUpUser = async (event) => {
    event.preventDefault(); // Prevent form default submission behavior
    setLoading(true);
    setTimeout(async () => {
      if (event.target.password.value !== event.target.confirm_password.value) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      setError(null); // Reset error message
      // Check if the password is strong
      const password = event.target.password.value;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) {
        setError(
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
        );
        setLoading(false);
        return;
      }
      setError(null); // Reset error message
      // Check if the email is valid
      const email = event.target.email.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Invalid email format");
        setLoading(false);
        return;
      }
      setError(null); // Reset error message
      // Check if the first name and last name are valid
      const firstName = event.target.first_name.value;
      const lastName = event.target.last_name.value;
      const nameRegex = /^[a-zA-Z]+$/;
      if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        setError("First name and last name must contain only letters");
        setLoading(false);
        return;
      }
      setError(null); // Reset error message
      try {
        const response = await axios.post(
          "https://events-platform-backend-production.up.railway.app/register",
          {
            first_name: event.target.first_name.value,
            last_name: event.target.last_name.value,
            email: event.target.email.value,
            password: event.target.password.value,
          }
        );

        // Redirect or update UI
        navigate("/verify");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response) {
          if (error.response.status === 400) {
            setError(
              "It seems that your username/password isn't correct. If you are sure you entered them correctly, please verify your email before logging in."
            );
          }
          if (error.response.data === "Email already registered") {
            setError("Email already exists");
          }
        } else if (error.request) {
          setError("Network error. Please try again later.");
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      }
    }, 100); // Simulate a delay for loading state
  };

  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    setAnnouncement(
      "You are now on the Sign Up page where you can create a new account."
    );
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

      <h1 className="browse-events-page-title">Sign Up</h1>
      <form onSubmit={signUpUser}>
        <div className="title-and-input">
          <label htmlFor="first_name">First Name: </label>
          <input type="text" id="first_name" name="first_name" required />
        </div>
        <div className="title-and-input">
          <label htmlFor="last_name">Last Name: </label>
          <input type="text" id="last_name" name="last_name" required />
        </div>
        <div className="title-and-input">
          <label htmlFor="email">Email: </label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="title-and-input">
          <label htmlFor="password">Password: </label>
          <input type="password" id="password" name="password" required />
        </div>
        <div className="title-and-input">
          <label htmlFor="confirm_password">Confirm Password: </label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            required
          />
        </div>
        <p
          id="error-message"
          style={{
            color: "red",
            display: error ? "block" : "none",
          }}
        >
          {error || "No errors yet."}
        </p>

        <div className="create-event-form-button-div">
          {/* <p>
            By signing up, you agree to our{" "}
            <a href="/terms-and-conditions">Terms and Conditions</a> and{" "}
            <a href="/privacy-policy">Privacy Policy</a>.
          </p> */}

          <button
            className="create-event-form-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>
      <p
        style={{
          textAlign: "center",
          margin: 0,
        }}
      >
        Already have an account?{" "}
        <a href="/login" aria-label="Log in to your account">
          Log In
        </a>
      </p>
    </div>
  );
};
export default SignUp;
