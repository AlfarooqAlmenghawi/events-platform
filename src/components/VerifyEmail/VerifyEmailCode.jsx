import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const VerifyEmailCode = () => {
  const { verification_code } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axios.get(
          `https://events-platform-backend-production.up.railway.app/verify/${verification_code}`
        );
        navigate(
          "/login?message=Email verified successfully. You can now log in."
        );
      } catch (error) {
        console.error("Verification failed:", error);
        if (error.response) {
          setError("Verification failed. Please try again.");
        } else {
          setError("An error occurred. Please try again later.");
        }
      }
    };

    verify();
  }, [verification_code]);

  return (
    <div className="event" style={{ textAlign: "center" }}>
      <h1 className="browse-events-page-title">Verifying your email...</h1>
      <p style={{ textAlign: "center" }}>
        Please check your email for a verification link.
      </p>
      <p style={{ textAlign: "center" }}>
        If you have already verified your email, please log in.
      </p>
      {error && <p>{error}</p>}
      {!error && <p>If you are not redirected, please check your email.</p>}
      {/* <p>Redirecting to login page...</p> */}
      <p>
        If you are not redirected, after a few seconds please click{" "}
        <a href="/login">here</a>.
      </p>
      <p>Thank you for your patience!</p>
    </div>
  );
};
export default VerifyEmailCode;
