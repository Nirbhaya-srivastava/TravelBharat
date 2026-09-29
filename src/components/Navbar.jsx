import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Shield, Menu, X, Compass, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, logout, admin } = useAuth();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
      setMobileOpen(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 py-1 px-2.5 rounded-lg ${
      isActive
        ? 'text-amber-700 bg-amber-50/80 font-semibold'
        : 'text-slate-700 hover:text-amber-800 hover:bg-slate-100/70'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-amber-950/10 transition-all">
      {/* Top micro-bar for cultural authenticity */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-700 h-1 w-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 rounded-xl p-1"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center shadow-md shadow-amber-900/10 group-hover:scale-105 transition-transform duration-300">
              <span className="font-serif text-xl font-bold tracking-tight">भ</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-extrabold tracking-wide text-slate-900 group-hover:text-amber-700 transition-colors">
                  TravelBharat
                </span>
              </div>
              <p className="text-[10px] tracking-wider uppercase font-semibold text-amber-800/80">
                Explore India State by State
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/states" className={navLinkClass}>
              States & UTs
            </NavLink>
            <NavLink to="/destinations" className={navLinkClass}>
              Destinations
            </NavLink>
            <NavLink to="/categories" className={navLinkClass}>
              Categories
            </NavLink>
            <NavLink to="/search" className={navLinkClass}>
              Explore Search
            </NavLink>
          </nav>

          {/* Right Action: Search Box & Admin */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search Bharat..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-44 lg:w-52 pl-9 pr-3 py-1.5 text-xs rounded-full bg-white/80 border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600 transition-all focus:w-64"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2 pointer-events-none" />
            </form>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 transition"
                  title={`Logged in as ${admin?.name || 'Admin'}`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300/80 bg-white/60 hover:bg-white px-3 py-1.5 rounded-lg transition"
              >
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                Admin
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              to="/search"
              className="p-2 text-slate-700 hover:text-amber-800 rounded-lg"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-600"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search destinations, states, cities..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          </form>

          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-slate-800 font-medium hover:bg-amber-50 rounded-lg"
            >
              Home
            </Link>
            <Link
              to="/states"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-slate-800 font-medium hover:bg-amber-50 rounded-lg"
            >
              States & Union Territories
            </Link>
            <Link
              to="/destinations"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-slate-800 font-medium hover:bg-amber-50 rounded-lg"
            >
              All Destinations
            </Link>
            <Link
              to="/categories"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-slate-800 font-medium hover:bg-amber-50 rounded-lg"
            >
              Categories
            </Link>
            <Link
              to="/search"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-slate-800 font-medium hover:bg-amber-50 rounded-lg"
            >
              Advanced Search
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-200">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-semibold text-amber-900 bg-amber-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5"
                >
                  <Shield className="w-4 h-4" />
                  Curator Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-xs text-red-600 font-medium hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-slate-700 hover:text-amber-800 inline-flex items-center gap-1.5"
              >
                <Shield className="w-4 h-4 text-amber-700" />
                Admin Portal Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
