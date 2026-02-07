import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={
                <div className="  w-full space-y-6 animate-in fade-in duration-700">
                  <h1 className="text-3xl font-bold">Dashboard</h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="p-6 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm"
                      >
                        <h3 className="text-gray-500 text-sm font-medium">
                          Stat {i}
                        </h3>
                        <p className="text-2xl font-bold mt-2">$24,500</p>
                      </div>
                    ))}
                  </div>
                </div>
              }
            />
            <Route
              path="/products"
              element={
                <div className="p-8">
                  <h1>Products Listing</h1>
                </div>
              }
            />
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
