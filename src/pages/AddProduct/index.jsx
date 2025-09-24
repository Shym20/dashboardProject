import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import DashboardApi from "../../apis/dashboard/dashboard.api";
import ProductForm from "../ProductForm";

export default function AddProduct({ mode = "add" }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const dashboardApi = new DashboardApi();

  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchProduct = async () => {
        const response = await dashboardApi.instance.get(`/api/product/get-product/${id}`);
        setProduct(response.data);
      };
      fetchProduct();
    }
  }, [mode, id]);

  if (mode === "edit" && !product) return <p>Loading product...</p>;

  return (
    <ProductForm
      mode={mode}
      initialData={product}
      onSuccess={() => navigate("/dashboard")}
    />
  );
}
