import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // decoded user info

  useEffect(() => {
    const verifyAndFetchUser = async () => {
      const token = Cookies.get("authToken");

      if (token) {
        try {
          const response = await axios.get(
            "https://events-platform-backend-production.up.railway.app/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Fresh user data from DB:", response.data);

          setUser(response.data); // Set fresh DB user
        } catch (err) {
          console.error(
            "Token verification or user fetch failed:",
            err.message
          );
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
      "https://events-platform-backend-production.up.railway.app/profile",
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
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
