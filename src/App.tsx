import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "@/components/layout/AppLayout";
import DashboardPage from "@/app/DashboardPage";
import ProductListPage from "@/app/products/ProductListPage";
import ProductFormPage from "@/app/products/ProductFormPage";
import ProductDetailPage from "@/app/products/ProductDetailPage";
import UserListPage from "@/app/users/UserListPage";
import SettingsPage from "@/app/SettingsPage";
import LoginPage from "@/app/auth/LoginPage";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/products/add" element={<ProductFormPage />} />
            <Route path="/products/edit/:id" element={<ProductFormPage />} />
            <Route path="/users" element={<UserListPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
