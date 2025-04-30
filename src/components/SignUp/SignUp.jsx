import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate(); // For redirecting after login

  const [error, setError] = useState(null);

  const signUpUser = async (event) => {
    event.preventDefault(); // Prevent form default submission behavior

    if (event.target.password.value !== event.target.confirm_password.value) {
      console.error("Passwords do not match");
      setError("Passwords do not match");
      return;
    }
    setError(null); // Reset error message
    // Check if the password is strong
    const password = event.target.password.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      console.error(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
      );
      setError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }
    setError(null); // Reset error message
    // Check if the email is valid
    const email = event.target.email.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format");
      setError("Invalid email format");
      return;
    }
    setError(null); // Reset error message
    // Check if the first name and last name are valid
    const firstName = event.target.first_name.value;
    const lastName = event.target.last_name.value;
    const nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      console.error("First name and last name must contain only letters");
      setError("First name and last name must contain only letters");
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
    } catch (error) {
      if (error.response) {
        console.error("Sign Up failed:", error.response);
      } else {
        console.error("Sign Up error:", error.message);
      }
    }
  };

  return (
    <div className="event">
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

          <button className="create-event-form-button" type="submit">
            Sign Up
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
