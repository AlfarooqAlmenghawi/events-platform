import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // decoded user info

  useEffect(() => {
    const verifyAndFetchUser = async () => {
      const token = Cookies.get("authToken");

      if (token) {
        try {
          const response = await axios.get(
            "https://events-platform-backend-5pjx.onrender.com/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUser(response.data); // Set fresh DB user
        } catch (err) {
          setUser(null);
        }
      }
    };

    verifyAndFetchUser();
  }, []);

  const login = async (token) => {
    Cookies.set("authToken", token, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });

    const response = await axios.get(
      "https://events-platform-backend-5pjx.onrender.com/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setUser(response.data);
  };

  const logout = () => {
    Cookies.remove("authToken");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
