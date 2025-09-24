import React, { useCallback, useEffect, useRef, useState } from "react";
import { FiEdit2, FiEye } from "react-icons/fi";
import { MdUploadFile } from "react-icons/md";
import { useSelector } from "react-redux";
import ProfileApi from "../../apis/profile/profile.api";
import { toast } from "react-toastify";
import axios from "axios";
import defaultImage from '../../assets/images/default-user-image.png'

export default function Profile() {
  const portUrl = import.meta.env.VITE_API_URL;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("creator");
  const [showAccount, setShowAccount] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const profileApi = new ProfileApi();

  const [showConfirmAccount, setShowConfirmAccount] = useState(false);
  const tokenFromRedux = useSelector((state) => state.user?.clipC_auth_token);
  const token = tokenFromRedux || localStorage.getItem("clipC_auth_token");
  const profile = useSelector((state) => state.user?.profile);
  const [profilee, setProfilee] = useState(null);

  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(defaultImage); // Local preview
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // Store uploaded URL
  // 🏦 Bank state
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [document, setDocument] = useState(null);
  const [documentUrl, setDocumentUrl] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [documentUploading, setDocumentUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Step 1: Show local preview immediately
    setPreview(URL.createObjectURL(file));

    const uploadData = new FormData();
    uploadData.append("thumbnail", file);

    try {
      const res = await axios.post(`${portUrl}/api/upload`, uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const url = res.data?.data?.fileUrl;
      if (!url) throw new Error("Image upload failed");

      // Step 2: Just store the uploaded image URL, don't update profile yet
      setUploadedImageUrl(url);
    } catch (err) {
      console.error("Upload failed:", err?.response?.data || err.message);
      toast.error("Image upload failed");
    }
  };

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await profileApi.getProfile();
      if (response?.code === 200) {
        setProfilee(response?.data);
        console.log("Fetched profileeeeeeee:", response.data);
      } else {
        toast.error("Failed to load profile info");
      }
    } catch (err) {
      toast.error("An error occurred while fetching profile");
      console.error("Profile fetch error: ", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profilee) {
      setFullName(profilee.fullname || "");
      setEmail(profilee.email || "");
      setPhone(profilee.mobile || "");

      // ✅ Set preview if profilePic exists
      if (profilee.profilePic) {
        setPreview(profilee.profilePic);
      }
    }
  }, [profilee]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const payload = {
      fullname: fullName,
      mobile: phone,
      profilePic: uploadedImageUrl || preview, // fallback to existing preview
      email,
      password,
    };

    try {
      setLoading(true);
      const res = await profileApi.updateProfile(payload);

      if (res.code === 200) {
        toast.success("Profile updated successfully");
        fetchProfile(); // Refresh the data
      } else {
        toast.error(res?.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const res = await profileApi.getBankDetails();
        const data = res?.data;

        if (data) {
          setAccountHolderName(data?.accountHolderName || "");
          setAccountNumber(data?.accountNumber || "");
          // setConfirmAccountNumber(data.accountNumber || ""); // optional
          setIfscCode(data?.ifscCode || "");
          setBankName(data?.bankName || "");
          setDocumentUrl(data?.nationalDocument); // if you're supporting preview later
        }
      } catch (err) {
        console.error("Failed to fetch bank details:", err);
      }
    };

    fetchBankDetails();
  }, []);

  const handleDocumentUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("File size exceeds 5MB");
    }

    const uploadData = new FormData();
    uploadData.append("thumbnail", file); // or rename field to `document` if backend expects that

    try {
      setDocumentUploading(true);

      const res = await axios.post(`${portUrl}/api/upload`, uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const url = res.data?.data?.fileUrl;

      if (!url) throw new Error("Document upload failed");

      setDocumentUrl(url);
      setDocumentFile(file);
      toast.success("Document uploaded successfully");
    } catch (err) {
      console.error("Document upload error:", err);
      toast.error("Failed to upload document");
    } finally {
      setDocumentUploading(false);
    }
  };

  const handleBankUpdate = async (e) => {
    e.preventDefault();

    if (accountNumber !== confirmAccountNumber) {
      return toast.error("Account numbers do not match");
    }

    if (!documentUrl) {
      return toast.error("Please upload your national document");
    }

    const payload = {
      accountHolderName: accountHolderName,
      accountNumber,
      ifscCode: ifscCode,
      bankName,
      nationalDocument: documentUrl, // 👈 included in API payload now
    };

    try {
      setLoading(true);
      const res = await profileApi.updateBankDetails(payload);

      if (res.code === 200) {
        toast.success("Bank details updated");
      } else {
        toast.error(res?.message || "Update failed");
      }
    } catch (err) {
      console.error("Bank update error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-auto scrollbar-none">
      {/* Gradient Header */}
      <div
        className="relative h-40 rounded-t-3xl flex justify-end items-start p-4"
        style={{
          background:
            "linear-gradient(180deg, #E04A6A 0%, #772C6A 50%, #713AA9 100%)",
        }}
      >
        {/* Avatar + Edit Button */}
        <div
          className="
          absolute 
          -bottom-12 
          left-1/2 
          md:left-42
          transform 
          -translate-x-1/2 
          flex flex-col items-center
        "
        >
          {/* Avatar Container */}
          <div className="relative w-24 h-24 md:w-28 md:h-28">
            {/* Avatar Circle */}
            <div
              className="
              w-full h-full
              bg-white 
              rounded-full 
              overflow-hidden
              border-4 border-white 
              shadow
            "
            >
              <img
                src={preview || "https://i.pravatar.cc/300"}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Edit Icon Outside Avatar */}
            <div
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-2 right-2 bg-purple-600 p-1 rounded-full text-white text-xs cursor-pointer shadow-md"
            >
              <FiEdit2 className="w-4 h-4" />
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              name="thumbnail"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mt-24 md:mt-30">
        <div className="flex w-full max-w-3xl justify-around border-b border-gray-200">
          <button
            onClick={() => setActiveTab("creator")}
            className={`pb-2 border-b-2 ${
              activeTab === "creator"
                ? "border-purple-600 text-[#171717] text-[24px] font-[500]"
                : "border-transparent text-[#24292E] text-[20px] font-[500]"
            }`}
          >
            Creator Detail
          </button>
          <button
            onClick={() => setActiveTab("bank")}
            className={`pb-2 border-b-2 ${
              activeTab === "bank"
                ? "border-purple-600 text-[#171717] text-[24px] font-[500]"
                : "border-transparent text-[#24292E] text-[20px] font-[500] "
            }`}
          >
            Bank Account Detail
          </button>
        </div>
      </div>

      {/* Form */}
      {activeTab === "creator" ? (
        <>
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-5xl mx-auto mt-8 px-4"
          >
            <div>
              <label className="block text-[#24292E] text-[14px] font-[400] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full border border-[#CED2D6] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="grid grid-cols-1 mt-4 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#24292E] text-[14px] font-[400]  mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+ 151 151 5154856"
                  className="w-full border border-[#CED2D6] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-[#24292E] text-[14px] font-[400]  mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="abc@gmail.com"
                  className="w-full border text-gray-500 border-[#CED2D6] rounded px-3 py-2"
                />
              </div>
              {/* <div>
                <label className="block text-[#24292E] text-[14px] font-[400]  mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-[#CED2D6] rounded px-3 py-2 pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    <FiEye />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[#24292E] text-[14px] font-[400]  mb-1">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-[#CED2D6] rounded px-3 py-2 pr-10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    <FiEye />
                  </button>
                </div>
              </div> */}
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="bg-[#7638A5] text-white px-12 py-2 text-[12px] font-[500] rounded-full hover:bg-purple-800 transition"
              >
                Save
              </button>
            </div>
          </form>
        </>
      ) : activeTab === "bank" ? (
        <>
          <form
            className="w-full max-w-5xl mx-auto mt-8 px-4"
            onSubmit={handleBankUpdate}
          >
            <div>
              <label className="block text-[#24292E] text-[14px] font-[400] mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                placeholder="Full name as per bank records"
                className="w-full border border-[#CED2D6] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="grid grid-cols-1 mt-4 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#24292E] text-[14px] font-[400] mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  placeholder="Enter IFSC code"
                  className="w-full border border-[#CED2D6] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-[#24292E] text-[14px] font-[400] mb-1">
                  Bank Name
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full border border-[#CED2D6] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>Select your bank</option>
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                </select>
              </div>
              <div className="relative">
                <label className="block text-[#24292E] text-[14px] font-[400] mb-1">
                  Account Number
                </label>
                <input
                  type={showAccount ? "text" : "password"}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="********"
                  className="w-full border border-[#CED2D6] rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <button
                  type="button"
                  onClick={() => setShowAccount(!showAccount)}
                  className="absolute right-3 top-10 text-gray-500"
                >
                  <FiEye />
                </button>
              </div>
              <div className="relative">
                <label className="block text-[#24292E] text-[14px] font-[400] mb-1">
                  Confirm Account Number
                </label>
                <input
                  type={showConfirmAccount ? "text" : "password"}
                  value={confirmAccountNumber}
                  onChange={(e) => setConfirmAccountNumber(e.target.value)}
                  placeholder="********"
                  className="w-full border border-[#CED2D6] rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmAccount(!showConfirmAccount)}
                  className="absolute right-3 top-10 text-gray-500"
                >
                  <FiEye />
                </button>
              </div>
              <div>
                <label className="block text-[#24292E] text-[14px] font-[400] mb-1">
                  National Document
                </label>

                <label
                  htmlFor="document-upload"
                  className="flex items-center gap-3 cursor-pointer bg-white border border-[#CED2D6] rounded px-3 py-2 text-gray-500 hover:bg-gray-50"
                >
                  <MdUploadFile className="w-6 h-6 text-[#7638A5]" />
                  <div className="flex flex-col">
                    <p className="text-[#24292E] text-[14px] font-[500]">
                      {documentFile
                        ? documentFile.name
                        : "Upload National Document"}
                    </p>
                    <p className="text-[12px] font-[400] text-[#596066]">
                      Max size: 5MB | .pdf, .jpg, .png
                    </p>
                  </div>
                  {documentUploading && (
                    <span className="ml-auto text-sm text-purple-500 animate-pulse">
                      Uploading...
                    </span>
                  )}
                </label>

                <input
                  id="document-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />

                {documentUrl && (
                  <a
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 text-sm underline mt-2 inline-block"
                  >
                    View uploaded document
                  </a>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="bg-[#7638A5] text-white px-12 py-2 text-[12px] font-[500] rounded-full hover:bg-purple-800 transition"
              >
                Save
              </button>
            </div>
          </form>
        </>
      ) : activeTab === "channel" ? (
        <>
          <form className="w-full max-w-5xl mx-auto mt-8 px-4">
            <div>
              <label className="block text-[#24292E] text-[14px] font-[400] mb-1">
                Channel Name
              </label>
              <input
                type="text"
                placeholder="Enter channel name"
                className="w-full border border-[#CED2D6] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mt-4">
              <label className="block text-[#24292E] text-[14px] font-[400] mb-1">
                Channel URL
              </label>
              <input
                type="url"
                placeholder="https://www.youtube.com/yourchannel"
                className="w-full border border-[#CED2D6] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="mt-4">
              <label className="block text-[#24292E] text-[14px] font-[400] mb-1">
                Channel Description
              </label>
              <textarea
                placeholder="Write something about your channel"
                className="w-full border border-[#CED2D6] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={4}
              />
            </div>
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="bg-[#7638A5] text-white px-12 py-2 text-[12px] font-[500] rounded-full hover:bg-purple-800 transition"
              >
                Save
              </button>
            </div>
          </form>
        </>
      ) : null}
    </div>
  );
}
