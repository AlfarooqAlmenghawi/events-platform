import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const SignUp = () => {
  const navigate = useNavigate(); // For redirecting after login

  const signUpUser = async (event) => {
    event.preventDefault(); // Prevent form default submission behavior

    if (event.target.password.value !== event.target.confirm_password.value) {
      console.error("Passwords do not match");
      return;
    }

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

      console.log("Sign Up successful!");
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
    </div>
  );
};
export default SignUp;
