import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import DashboardApi from "../../apis/dashboard/dashboard.api";

const categories = ["Electronics", "Fashion", "Books", "Furniture"];
const subCategories = {
  Electronics: ["Mobiles", "Laptops", "Headphones"],
  Fashion: ["Clothes", "Shoes", "Accessories"],
  Books: ["Fiction", "Non-Fiction", "Comics"],
  Furniture: ["Tables", "Chairs", "Beds"],
};

export default function ProductForm({ mode = "add", initialData = {}, onSuccess }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [showNewCategory, setShowNewCategory] = useState(false);
const [newCategoryName, setNewCategoryName] = useState("");

const [showNewSubCategory, setShowNewSubCategory] = useState(false);
const [newSubCategoryName, setNewSubCategoryName] = useState("");

  const [specifications, setSpecifications] = useState([{ title: "", value: "" }]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  useEffect(() => {
   const fetchCategories = async () => {
  try {
    const dashboardApi = new DashboardApi();
    const catRes = await dashboardApi.getCategories();
    const subRes = await dashboardApi.getSubCategories();

    const cats = Array.isArray(catRes.data) ? catRes.data : [];
    const subs = Array.isArray(subRes.data) ? subRes.data : [];

    setCategories(cats);

    const subMap = {};
    subs.forEach((s) => {
      if (!subMap[s.category]) subMap[s.category] = [];
      subMap[s.category].push(s.name);
    });
    setSubCategories(subMap);
  } catch (err) {
    console.error("Failed to fetch categories/subcategories", err);
    setCategories([]);
    setSubCategories({});
  }
};


    fetchCategories();
  }, []);


  const handleAddCategory = async () => {
  if (!newCategoryName.trim()) return alert("Enter a category name");
  try {
    const dashboardApi = new DashboardApi();
    const res = await dashboardApi.addCategory({ name: newCategoryName });
    setCategories((prev) => [...prev, { _id: res.data._id, name: newCategoryName }]);
    setCategory(newCategoryName);
    setNewCategoryName("");
    setShowNewCategory(false);
  } catch (err) {
    console.error(err);
    alert("Failed to add category");
  }
};

const handleAddSubCategory = async () => {
  if (!newSubCategoryName.trim() || !category) return alert("Select category and enter sub-category name");
  try {
    const dashboardApi = new DashboardApi();
    const res = await dashboardApi.addSubCategory({ name: newSubCategoryName, category });
    setSubCategories((prev) => ({
      ...prev,
      [category]: [...(prev[category] || []), newSubCategoryName],
    }));
    setSubCategory(newSubCategoryName);
    setNewSubCategoryName("");
    setShowNewSubCategory(false);
  } catch (err) {
    console.error(err);
    alert("Failed to add sub-category");
  }
};


  // Prefill in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title || "");
      setPrice(initialData.price || "");
      setDescription(initialData.description || "");
      setCategory(initialData.category || "");
      setSubCategory(initialData.subcategory || "");
      setSpecifications(initialData.specification || [{ title: "", value: "" }]);

      // For existing images/pdf from backend
      if (initialData.fileUrl) {
        setImages(
          initialData.fileUrl.map((url) => ({
            file: null,
            preview: url, // already hosted
          }))
        );
      }
      if (initialData.file) {
        setPdfFile({ name: "Existing PDF", preview: initialData.file });
      }
    }
  }, [mode, initialData]);

  // Image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - images.length);
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages([...images, ...previews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // PDF upload
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPdfFile(file);
  };

  // Specifications handlers
  const addSpecification = () => setSpecifications([...specifications, { title: "", value: "" }]);
  const removeSpecification = (index) => setSpecifications(specifications.filter((_, i) => i !== index));
  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!title || !description || !category || !subCategory || !price) {
      alert("Please fill all required fields");
      return;
    }
    if (specifications.some((s) => !s.title || !s.value)) {
      alert("Please fill all specification fields");
      return;
    }
    if (!pdfFile && mode === "add") {
      alert("Please upload a PDF file");
      return;
    }
    if (images.length === 0 && mode === "add") {
      alert("Please select at least one product image");
      return;
    }

    try {
      const formData = new FormData();

      // Send product ID for edit
      if (mode === "edit" && initialData._id) {
        formData.append("id", initialData._id);
      }

      // Basic product info
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subcategory", subCategory);
      formData.append("price", price);

      if (mode === "edit" && initialData._id) {
        formData.append("id", initialData._id);
      }

      // PDF
      if (pdfFile instanceof File) {
        formData.append("file", pdfFile);
      } else if (pdfFile?.preview) {
        formData.append("existingFile", pdfFile.preview); // send URL or ID to keep
      }

      // Specifications
      specifications.forEach((spec, index) => {
        formData.append(`specification[${index}][title]`, spec.title);
        formData.append(`specification[${index}][value]`, spec.value);
      });

      // Images: only new uploads
      images.forEach((img) => {
        if (img.file) {
          formData.append("fileUrl", img.file); // new uploads
        } else if (img.preview) {
          formData.append("existingFileUrl", img.preview); // keep existing
        }
      });

      const dashboardApi = new DashboardApi();
      const response =
        mode === "add"
          ? await dashboardApi.addProduct(formData)
          : await dashboardApi.updateProduct(initialData._id, formData) // PATCH with ID

      console.log(`${mode} Product Response:`, response);
      alert(`Product ${mode === "add" ? "added" : "updated"} successfully!`);

      if (onSuccess) onSuccess(response);

      if (mode === "add") {
        // Reset form
        setTitle("");
        setPrice("");
        setDescription("");
        setCategory("");
        setSubCategory("");
        setSpecifications([{ title: "", value: "" }]);
        setImages([]);
        setPdfFile(null);
      }
    } catch (err) {
      console.error(`Failed to ${mode} product:`, err);
      alert(`Failed to ${mode} product. Try again.`);
    }
  };


  return (
    <motion.form
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-2xl shadow-lg"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {mode === "add" ? "Add New Product" : "Edit Product"}
      </h1>

      {/* Title */}
      <div className="flex flex-col">
        <label className="font-semibold text-gray-700 mb-2">Product Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
          placeholder="Enter product title"
          required
        />
      </div>

      {/* Price */}
      <div className="flex flex-col">
        <label className="font-semibold text-gray-700 mb-2">Price (₹)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
          placeholder="Enter product price"
          min="0"
          required
        />
      </div>

      {/* Images */}
      <div className="flex flex-col">
        <label className="font-semibold text-gray-700 mb-2">
          Product Images (max 5) {images.length > 0 && `(${images.length}/5 selected)`}
        </label>
        <div
          className="flex flex-wrap gap-4 mb-4 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-purple-500"
          onClick={() => document.getElementById("imageInput").click()}
        >
          {images.map((img, idx) => (
            <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
              <img src={img.preview} alt={`preview ${idx}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(idx);
                }}
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
              >
                <AiOutlineClose size={16} className="text-red-600" />
              </button>
            </div>
          ))}

          {images.length < 5 && (
            <div className="flex items-center justify-center w-24 h-24 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100">
              <AiOutlinePlus size={24} className="text-gray-400" />
            </div>
          )}
        </div>
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* PDF */}
      <div className="flex flex-col">
        <label className="font-semibold text-gray-700 mb-2">Upload PDF</label>
        <input type="file" accept=".pdf" onChange={handlePdfUpload} />
        {pdfFile && <p className="mt-1 text-sm text-gray-600">{pdfFile.name || "Existing PDF"}</p>}
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="font-semibold text-gray-700 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 h-32 resize-none"
          placeholder="Enter product description"
          required
        />
      </div>

      {/* Specifications */}
    <div className="flex flex-col">
  <label className="font-semibold text-gray-700 mb-2">Specifications</label>
  {specifications.map((spec, idx) => (
    <div
      key={idx}
      className="flex flex-col md:flex-row gap-3 mb-2 items-stretch md:items-center"
    >
      <input
        type="text"
        value={spec.title}
        onChange={(e) => handleSpecChange(idx, "title", e.target.value)}
        placeholder="Title"
        className="border border-gray-300 rounded-lg px-3 py-2 flex-1 w-full"
      />
      <input
        type="text"
        value={spec.value}
        onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
        placeholder="Value"
        className="border border-gray-300 rounded-lg px-3 py-2 flex-1 w-full"
      />
      <button
        type="button"
        onClick={() => removeSpecification(idx)}
        className="text-red-600 flex justify-center items-center mt-2 md:mt-0"
      >
        <AiOutlineClose size={20} />
      </button>
    </div>
  ))}

  <button
    type="button"
    onClick={addSpecification}
    className="flex items-center gap-1 text-purple-600 font-semibold mt-2"
  >
    <AiOutlinePlus /> Add Specification
  </button>
</div>


      {/* Category & Sub-category */}

<div className="flex flex-col md:flex-row gap-4">
  {/* Category */}
  <div className="flex-1 flex flex-col">
    <label className="font-semibold text-gray-700 mb-2">Category</label>
    <div className="flex flex-col sm:flex-row gap-2">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 flex-1 w-full"
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => setShowNewCategory(true)}
        className="text-purple-600 font-semibold px-3 py-2 border border-purple-600 rounded-lg w-full sm:w-auto"
      >
        + Add
      </button>
    </div>

    {showNewCategory && (
      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <input
          type="text"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 flex-1 w-full"
        />
        <button
          type="button"
          onClick={handleAddCategory}
          className="bg-purple-600 text-white px-3 py-2 rounded-lg w-full sm:w-auto"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setShowNewCategory(false)}
          className="text-red-600 px-3 py-2 rounded-lg w-full sm:w-auto"
        >
          Cancel
        </button>
      </div>
    )}
  </div>

  {/* Sub-Category */}
  <div className="flex-1 flex flex-col">
    <label className="font-semibold text-gray-700 mb-2">Sub-Category</label>
    <div className="flex flex-col sm:flex-row gap-2">
      <select
        value={subCategory}
        onChange={(e) => setSubCategory(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 flex-1 w-full"
        required
      >
        <option value="">Select Sub-Category</option>
        {category &&
          subCategories[category]?.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
      </select>
      <button
        type="button"
        onClick={() => setShowNewSubCategory(true)}
        className="text-purple-600 font-semibold px-3 py-2 border border-purple-600 rounded-lg w-full sm:w-auto"
      >
        + Add
      </button>
    </div>

    {showNewSubCategory && (
      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <input
          type="text"
          placeholder="New sub-category name"
          value={newSubCategoryName}
          onChange={(e) => setNewSubCategoryName(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 flex-1 w-full"
        />
        <button
          type="button"
          onClick={handleAddSubCategory}
          className="bg-purple-600 text-white px-3 py-2 rounded-lg w-full sm:w-auto"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setShowNewSubCategory(false)}
          className="text-red-600 px-3 py-2 rounded-lg w-full sm:w-auto"
        >
          Cancel
        </button>
      </div>
    )}
  </div>
</div>



      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-purple-700 transition"
      >
        {mode === "add" ? "Add Product" : "Update Product"}
      </motion.button>
    </motion.form>
  );
}
