import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/Home";
import Layout from "./layout";
import Logout from "./pages/Logout";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/protectedRoute";
import RootRedirect from "./pages/Root";
import CreatorResetPassword from "./pages/Reset-Password";
import AddProduct from "./pages/AddProduct";
import './App.css'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<CreatorResetPassword />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
            <Layout>
              <Home />
            </Layout>
        }
      />
      <Route
        path="/add-product"
        element={
            <Layout>
              <AddProduct />
            </Layout>
        }
      />
      <Route
        path="/logout"
        element={
          <ProtectedRoute>
            <Layout>
              <Logout />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
  path="/edit-product/:id"
  element={
    <Layout>
      <AddProduct mode="edit" />
    </Layout>
  }
/>
      
    </Routes>
  );
}

export default App;
