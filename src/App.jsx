import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import HomePage from './pages/HomePage.jsx';
import StatesPage from './pages/StatesPage.jsx';
import StateDetailsPage from './pages/StateDetailsPage.jsx';
import DestinationsPage from './pages/DestinationsPage.jsx';
import DestinationDetailsPage from './pages/DestinationDetailsPage.jsx';
import CategoriesPage from './pages/CategoriesPage.jsx';
import SearchPage from './pages/SearchPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-900 selection:bg-amber-500/20 selection:text-amber-900">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/states" element={<StatesPage />} />
          <Route path="/states/:stateSlug" element={<StateDetailsPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:slug" element={<DestinationDetailsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:slug" element={<CategoriesPage />} />
          <Route path="/search" element={<SearchPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
