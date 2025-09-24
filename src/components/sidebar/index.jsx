import {
  HomeIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { RiVideoUploadLine } from "react-icons/ri";
import { HiOutlineLogin } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { MdOutlineAddToPhotos } from "react-icons/md";

export default function Sidebar({ sidebarOpen }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Instead of fetching profile from API, just use a static fallback
  const user = useSelector((state) => state.user?.clipC_user_info);
  const [preview] = useState("https://i.pravatar.cc/300"); // static avatar

  return (
    <aside
      className={`${
        sidebarOpen
          ? "fixed left-0 w-60 flex lg:static"
          : "hidden lg:flex w-12 items-center"
      } justify-start md:justify-between flex-col bg-white z-50 h-full overflow-y-auto pr-3 pl-3 md:pl-0 md:py-6 text-sm md:ml-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent transition-all duration-300 ease-in-out`}
    >
      {/* Main Nav */}
      <nav className={`space-y-2 ${sidebarOpen ? "" : "flex flex-col"}`}>
        <Link to="/dashboard">
          <button
            className={`flex w-full items-center cursor-pointer text-[16px] space-x-3 px-3 py-2 rounded-md ${
              currentPath === "/dashboard"
                ? "bg-[#7638A51A] font-[500] text-[#7638A5]"
                : "text-[#24292E] hover:text-purple-600"
            }`}
          >
            <FiShoppingCart  className="w-5 h-5" />
            {sidebarOpen && <span>Products</span>}
          </button>
        </Link>

        <Link to={"/add-product"}>
          <button
            className={`flex w-full text-[16px] cursor-pointer items-center space-x-3 px-3 py-2 rounded-md ${
              currentPath === "/add-product"
                ? "bg-[#7638A51A] font-[500] text-[#7638A5]"
                : "text-[#24292E] hover:text-purple-600"
            }`}
          >
            <MdOutlineAddToPhotos className="w-5 h-5" />
            {sidebarOpen && <span>Add Product</span>}
          </button>
        </Link>

        <Link to={"/logout"}>
          <button
            className={`flex border-b text-[16px] cursor-pointer pb-4 w-full border-[#D4D4D4] items-center space-x-3 px-3 py-2 rounded-md ${
              currentPath === "/logout"
                ? "bg-[#7638A51A] font-[500] text-[#7638A5]"
                : "text-[#24292E] hover:text-purple-600"
            }`}
          >
            <HiOutlineLogin className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </Link>
      </nav>
    </aside>
  );
}
