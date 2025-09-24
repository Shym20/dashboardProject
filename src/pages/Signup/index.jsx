import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import LoginImage from "../../assets/images/login-side-image.png";
import Logo from "../../assets/images/logo.png";
import loginBg from "../../assets/images/login-bg.png";

export default function Signup() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
  const { name, contact, email, password, confirmPassword } = formData;
  const newErrors = {};

  if (!name) newErrors.name = "Name is required.";
  if (!contact) newErrors.contact = "Contact is required.";
  else if (!/^\d{10}$/.test(contact)) newErrors.contact = "Enter a valid 10-digit contact.";

  if (!email) newErrors.email = "Email is required.";
  else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) newErrors.email = "Invalid email address.";
  }

  if (!password) newErrors.password = "Password is required.";
  else if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";

  if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required.";
  else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

  setErrors(newErrors);
  console.log("Validation Errors:", newErrors);

  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const { name, contact, email, password } = formData;

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/creator/auth/signup`,
        {
          fullname: name,
          contact,
          email,
          password,
        }
      );

      if (response?.data?.code === 201) {
        toast.success("Signup successful!");
        setFormData({
          name: "",
          contact: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      } else {
        toast.error(response?.data?.message || "Signup failed.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "An error occurred during signup."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen bg-cover bg-center"
     
    >

      <div className="flex w-full items-center justify-center p-1">
        <div className="max-w-xl bg-white border-2 border-gray-200 shadow-2xl p-6 px-10 rounded-2xl w-full">
          <div className="flex justify-center">
            <div className="text-4xl font-bold text-gray-800">
              Dashboard
            </div>
          </div>
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-700 font-noto-serif">
            Welcome to Dashboard
          </h2>
          <p className="mt-2 font-poppins text-center text-sm text-gray-600">
            Enter your details to create your creator account
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="mb-4">
              <label className="mb-1 block font-poppins text-black">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-[#e4d7ed] rounded-md px-2 py-2.5"
                placeholder="Enter your name"
              />
              {errors.name && (
  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
)}
            </div>

            {/* Contact */}
            <div className="mb-4">
              <label className="mb-1 block font-poppins text-black">
                Contact
              </label>
              <input
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                min={10}
                max={10}
                type="tel"
                required
                className="w-full bg-[#e4d7ed] rounded-md px-2 py-2.5"
                placeholder="Enter your contact number"
              />
             {errors.contact && (
  <p className="text-red-500 text-sm mt-1">{errors.contact}</p>
)}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="mb-1 block font-poppins text-black">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#e4d7ed] rounded-md px-2 py-2.5"
                placeholder="Enter your email"
              />
             {errors.email && (
  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
)}
            </div>

            {/* Password */}
            <div className="relative mb-4">
              <label className="mb-1 block font-poppins text-black">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-[#e4d7ed] rounded-md px-2 py-2.5 pr-10"
                placeholder="Enter your password"
              />
             {errors.password && (
  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
)}
              <button
                type="button"
                className="absolute top-10 right-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative mb-4">
              <label className="mb-1 block font-poppins text-black">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-[#e4d7ed] rounded-md px-2 py-2.5 pr-10"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
)}
              <button
                type="button"
                className="absolute top-10 right-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white rounded py-2 hover:bg-purple-700"
            >
              {loading ? "Signing up..." : "Signup"}
            </button>

            <div className="text-center mt-2">
              <span className="text-sm text-gray-700 font-poppins">
                Already have an account?{" "}
                <Link to="/login" className="text-purple-600 hover:underline">
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
