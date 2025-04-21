const VerifyEmailCode = () => {
  const { verification_code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await axios.post(
          `https://events-platform-backend-production.up.railway.app/verify/${verification_code}`
        );
        navigate("/login");
      } catch (error) {
        console.error("Verification failed:", error);
      }
    };

    verify();
  }, [verification_code]);

  return (
    <div>
      <h1>Verifying your email...</h1>
    </div>
  );
};
export default VerifyEmailCode;
