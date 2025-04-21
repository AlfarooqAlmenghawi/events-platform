import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate(); // For redirecting after login
  const { login } = useContext(AuthContext);

  const [error, setError] = useState(null);

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

      console.log(response.data);

      // Assuming the response contains a token
      const token = response.data.token;

      await login(token);
      console.log("Login successful!");

      navigate("/my-events");
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError(
            "It seems that your username/password isn't correct. If you are sure you entered them correctly, please verify your email before logging in."
          );
        }
        console.error("Login failed:", error.response);
      } else {
        console.error("Login error:", error.message);
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={loginUser}>
        <div>
          <label htmlFor="email">Email: </label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default Login;
