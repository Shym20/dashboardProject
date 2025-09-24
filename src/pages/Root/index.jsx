import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthenticated } from "../../hooks/useAuthenticated.hook";
const RootRedirect = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthenticated();

  useEffect(() => {
    if (isAuthenticated === null) return; // Still resolving auth status
    if (isAuthenticated) {
      navigate("/dashboard"); // Go to home if logged in
    } else {
      navigate("/login"); // Go to login if not
    }
  }, [isAuthenticated, navigate]);

  return null; // Or a cute lil spinner if you're feeling fancy
};

export default RootRedirect;
