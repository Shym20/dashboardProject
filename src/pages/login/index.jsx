import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../../app.css";
import AuthApi from "../../apis/auth/auth.api";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateUser, updateToken } from "../../redux/redux-slice/user.slice";
import { setTokenLocal, setUserLocal } from "../../utils/localStorage.util";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authApi = new AuthApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contact || !password) {
      toast.error("Please enter both contact and password");
      return;
    }

    try {
      const response = await authApi.login({ contact, password });

      if (response?.code === 200) {
        console.log("Login response:", response);

        const user = response?.data?.user;
        const token = response?.data?.token;

        // Save in Redux
        dispatch(updateUser(user));
        dispatch(updateToken(token));

        console.log("User to save in cookie:", user);

        setUserLocal(user);
        setTokenLocal(token);

        toast.success("Login successful");
        navigate("/dashboard");
      } else {
        toast.error(response?.data?.message || "Login failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="max-w-xl bg-white p-8 rounded-2xl shadow-lg w-full">
        <div className="text-4xl font-bold text-gray-800 text-center mb-6">Dashboard</div>
        <h2 className="text-center text-2xl font-semibold text-gray-700 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Enter your contact and password to access your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Contact */}
          <div>
            <label className="text-gray-700 text-sm font-medium mb-1 block">
              Contact
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Enter your contact number"
              className="w-full bg-[#e4d7ed] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-gray-700 text-sm font-medium mb-1 block">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-[#e4d7ed] rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-9 right-2 text-gray-600 hover:text-black"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
          >
            Login
          </button>

          {/* OR Divider */}
          <div className="flex items-center justify-center text-gray-500 mt-2">
            <span>OR</span>
          </div>

          {/* Google Login */}
          <button
            type="button"
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded bg-white text-gray-800 hover:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="h-5 w-5 mr-2"
            />
            Continue with Google
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-700 mt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-purple-600 hover:underline">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
