import React from "react";
import { useNavigate } from "react-router-dom";
import LogoutImg from "../../assets/images/logoutImg.png"
import { useDispatch } from "react-redux";
import { logout } from "../../utils/common.util";
import { toast } from "react-toastify";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(dispatch);
    toast.success("Logout successfully")
    navigate("/login");

  };

  return (
    <div className="flex flex-col items-center justify-center  bg-gray-50 p-4">
      <img
        src={LogoutImg}
        alt="Logout Illustration"
        className="w-48 mt-20 h-48 mb-6"
      />

      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2 text-center">
        Are you sure you want to log out?
      </h2>

      <p className="text-gray-500 mb-6 text-center max-w-md">
        You’ll need to log in again to access your dashboard and earnings.
      </p>

      <div className="flex gap-4">
        <button
          className="px-5 py-2 rounded-full border cursor-pointer border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          onClick={() => navigate("/dashboard")}
        >
          Stay Logged In
        </button>
        <button
          className="px-5 py-2 rounded-full cursor-pointer bg-purple-700 text-white hover:bg-purple-800 transition"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Logout;
