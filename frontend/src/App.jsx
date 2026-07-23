import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BasketProvider } from './context/BasketContext';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ItemDetail from './pages/ItemDetail';
import Basket from './pages/Basket';
import Checkout from './pages/Checkout';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BasketProvider>
          <div className="min-h-screen bg-paper">
            <Navbar />
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:id" element={<ItemDetail />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route
                  path="/basket"
                  element={<ProtectedRoute><Basket /></ProtectedRoute>}
                />
                <Route
                  path="/checkout"
                  element={<ProtectedRoute><Checkout /></ProtectedRoute>}
                />
                <Route
                  path="/profile"
                  element={<ProtectedRoute><Profile /></ProtectedRoute>}
                />
                <Route
                  path="/admin"
                  element={<ProtectedRoute managerOnly><AdminDashboard /></ProtectedRoute>}
                />
              </Routes>
            </ErrorBoundary>
          </div>
        </BasketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
