import React, { useEffect, useState } from "react";
import "react-circular-progressbar/dist/styles.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import DashboardApi from "../../apis/dashboard/dashboard.api";
import ProductForm from "../ProductForm";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const dashboardApi = new DashboardApi();

  // Fetch products
  const fetchProducts = async (pageNo = 1) => {
    try {
      setLoading(true);
      const response = await dashboardApi.instance.get(`/api/product/get-all-products?page=${pageNo}&limit=10`);
      const productsData = response?.data?.products || [];
      const paginationData = response?.data?.pagination || { totalPages: 1 };

      setProducts(productsData);
      setPagination(paginationData);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // Open modal
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const refreshProducts = () => fetchProducts(page);

  // Confirm delete
  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await dashboardApi.instance.delete(`/api/product/delete-product/${productToDelete._id}`);
      setProducts(products.filter((p) => p._id !== productToDelete._id));
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-hidden overflow-x-hidden scrollbar-none p-4 bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Products</h1>

        {products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.015 }}
                  className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition"
                >
                  {/* Show first image */}
                  <img
                    src={product.imageUrl?.[0] || "https://via.placeholder.com/300x200.png?text=No+Image"}
                    alt={product.title}
                    className="w-full h-40 object-cover"
                  />

                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800">{product.title}</h2>
                    <p className="text-sm line-clamp-3 text-gray-600 mt-1">{product.description}</p>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-lg font-bold text-purple-600">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </span>

                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/edit-product/${product._id}`)}
                          className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className={`px-4 py-2 rounded-lg border ${page === 1 ? "text-gray-400 border-gray-200 cursor-not-allowed" : "hover:bg-gray-100 border-gray-300"
                  }`}
              >
                Prev
              </button>

              {/* Page numbers */}
              {[...Array(pagination.totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setPage(idx + 1)}
                  className={`px-4 py-2 rounded-lg ${page === idx + 1 ? "bg-purple-600 text-white" : "border border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={page === pagination.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className={`px-4 py-2 rounded-lg border ${page === pagination.totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "hover:bg-gray-100 border-gray-300"
                  }`}
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 bg-opacity-50"></div>

            {/* Modal content */}
            <div className="relative bg-white rounded-xl p-6 w-96 shadow-lg z-10">
              <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
              <p className="mb-6">Are you sure you want to delete "{productToDelete?.title}"?</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Edit Product Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

            {/* Modal content */}
            <div className="relative bg-white rounded-xl p-6 w-[600px] shadow-lg z-10">
              <h2 className="text-xl font-semibold mb-4">Edit Product</h2>

              {/* Product Form goes here */}
              <ProductForm
                mode="edit"
                initialData={productToEdit}
                onSuccess={refreshProducts}   // callback to reload products after save
              />

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

export default Home;
