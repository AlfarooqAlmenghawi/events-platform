import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate(); // For redirecting after login
  const { login } = useContext(AuthContext);

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
    </div>
  );
};

export default Login;
