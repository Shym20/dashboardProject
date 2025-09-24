import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import Logo from "../../assets/images/logo.png";
import loginBg from '../../assets/images/login-bg.png';
import AuthApi from "../../apis/auth/auth.api";

const CreatorResetPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const authApi = new AuthApi();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must have 1 uppercase, 1 lowercase, 1 number, 1 special character & be at least 8 characters long."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.resetPassword({ password, token });
      if (response?.code === 200) {
        toast.success("Password reset successful 🔐");
        navigate("/login");
      } else {
        toast.error(response?.message || "Reset failed. Try again.");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message || err.message || "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Left Side Image Section */}
      <div className="invisible w-0 md:w-1/2 h-[100%] items-center justify-center md:visible md:flex">
        <div className="relative w-full h-[100%]">
         
        </div>
      </div>

      {/* Right Side Reset Password Form */}
      <div className="flex w-full md:w-3/4 items-center justify-center p-1">
        <div className="max-w-xl bg-white p-6 px-10 rounded-2xl w-full">
          <div className="flex justify-center">
            <img src={Logo} width={130} height={120} alt="logo" />
          </div>
          <h2 className="mt-8 text-center text-3xl font-semibold text-gray-900 font-noto-serif">
            Reset Password
          </h2>
          <p className="mt-2 font-poppins text-center text-sm text-gray-600">
            Please enter your new password below.
          </p>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="relative">
              <p className="mb-1 text-black">New Password</p>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#e4d7ed] rounded-md px-2 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-11 right-3 text-gray-600 hover:text-black"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <p className="mb-1 text-black">Confirm Password</p>
              <input
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#e4d7ed] rounded-md px-2 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded bg-purple-600 text-white hover:bg-purple-700 focus:outline-none ${
                loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatorResetPassword;
