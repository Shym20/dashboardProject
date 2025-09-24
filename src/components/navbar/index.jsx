import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bars3Icon,
  MicrophoneIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { MicrophoneIcon as MicSolidIcon } from "@heroicons/react/24/solid";
import Logo from "../../assets/images/logo.png";
import { HiOutlineBell } from "react-icons/hi";
import { MdNotificationsNone } from "react-icons/md";
import { useSelector } from "react-redux";
import ProfileApi from "../../apis/profile/profile.api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import defaultImage from '../../assets/images/default-user-image.png'
import { FiUser } from "react-icons/fi";
import bellInactive from "../../assets/images/bell-inactive.png"
import bellActive from "../../assets/images/bell-active.png"


export default function Header({ onToggleSidebar }) {
  const [search, setSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const user = useSelector((state) => state.user.v_user_info);

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [preview, setPreview] = useState(defaultImage);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    navigate("/profile");
    setOpen(false);
  };

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white  px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center space-x-2">
            <button className="p-2 cursor-pointer" onClick={onToggleSidebar}>
              <Bars3Icon className="w-6 h-6 text-gray-700" />
            </button>
            <Link to={"/dashboard"}>
              <div className="logopanel text-2xl font-bold text-gray-800 pl-1">
                Dashboard
              </div>

            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-4">
            {/* Mobile search icon */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileSearch(true)}
                className="p-2 text-gray-700"
              >
                <MagnifyingGlassIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center bg-[#7638A533] rounded-full px-1 md:px-1.5 py-1.5 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
               
                  <img
                    src={defaultImage}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                

                <div className="ml-3 pr-2 hidden md:block leading-tight">
                 
                    <p className="text-sm font-semibold text-gray-800">
                       Admin
                    </p>
                
                </div>
              </div>

              {/* Dropdown menu */}
              {open && (
                <div className="absolute right-3 mt-2 w-36 bg-white shadow-lg rounded-lg py-2 z-50">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FiUser className="text-lg" />
                    Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
