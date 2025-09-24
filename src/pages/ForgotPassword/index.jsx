import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import LoginImage from "../../assets/images/login-side-image.png";
import Logo from "../../assets/images/logo.png";
import "../../app.css";
import AuthApi from "../../apis/auth/auth.api";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import loginBg from '../../assets/images/login-bg.png';
import { updateResetToken } from "../../redux/redux-slice/user.slice";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const authApi = new AuthApi();
  const router = useNavigate();
  const [linkSent, setLinkSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.forgotPassword({ email });

      if (response?.code === 200) {
        toast.success("Password reset link sent to your email 📬");
        setLinkSent(true); // 👈 trigger UI switch
         dispatch(updateResetToken(response?.resetToken));
      } else {
        toast.error(response?.message || "Couldn't send reset link. Please try again.");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${loginBg})` }}>
      {/* Left Side Image Section */}
      <div className=" invisible w-0 md:w-1/2 h-[100%] items-center justify-center">
        <div className="relative w-full h-[100%]">
          <img
            src={LoginImage}
            alt="Login background"
            layout="fill"
            objectFit="cover"
            className="rounded-3xl h-[94vh]"
          />
        </div>
      </div>

      {/* Right Side Login Form */}
      <div className="flex w-full md:w-3/4 items-center justify-center p-1">
        <div className="max-w-xl bg-white p-6 px-10 rounded-2xl w-full">
          <div className="flex justify-center">
            <img src={Logo} width={130} height={120} alt="logo" />
          </div>
          <h2 className="mt-8 text-center text-3xl font-semibold text-gray-900 font-noto-serif">
            Welcome Back
          </h2>
          <p className="mt-2 font-poppins text-center text-sm text-gray-600">
            Enter your email and password to access your account
          </p>
           {!linkSent ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm">
                <div className="mb-4">
                  <p className="mb-1 text-black">Email</p>
                  <input
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#e4d7ed] rounded-md px-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                    placeholder="Enter your Email"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded bg-purple-600 text-white hover:bg-purple-700 focus:outline-none ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>

              <p className="mt-2 text-center text-sm">
                <Link href="/login" className="text-purple-600 hover:underline">
                  Back to Login
                </Link>
              </p>
            </form>
          ) : (
            <div className="mt-8 bg-green-100 text-green-800 p-4 rounded-2xl text-center">
              A reset link has been sent to your email 📬
              <br /> Please check your inbox and follow the instructions to
              reset your password.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
