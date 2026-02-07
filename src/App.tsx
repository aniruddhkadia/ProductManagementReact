import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ProductListPage from "./pages/products/ProductListPage";
import ProductFormPage from "./pages/products/ProductFormPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/add" element={<ProductFormPage />} />
            <Route path="/products/edit/:id" element={<ProductFormPage />} />
            <Route
              path="/users"
              element={
                <div className="p-8">
                  <h1>Users Management</h1>
                </div>
              }
            />
            <Route
              path="/settings"
              element={
                <div className="p-8">
                  <h1>Application Settings</h1>
                </div>
              }
            />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
