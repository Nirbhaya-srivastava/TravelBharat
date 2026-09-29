import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Shield, Heart, ExternalLink, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#121824] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-serif text-lg font-bold">
                भ
              </div>
              <span className="font-serif text-2xl font-bold tracking-wide text-white group-hover:text-amber-400 transition-colors">
                TravelBharat
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Discover India, one destination at a time. A digital tourism encyclopedia cataloging the culture, heritage, natural wonders, and timeless monuments of Bharat.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 bg-amber-950/40 border border-amber-800/40 px-3 py-2 rounded-xl max-w-sm">
              <Compass className="w-4 h-4 shrink-0" />
              <span>Informational & Educational Non-Commercial Encyclopedia</span>
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h4 className="text-white font-serif font-semibold text-sm tracking-wider uppercase mb-4">
              Explore Bharat
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/states" className="hover:text-amber-400 transition-colors">
                  States & Union Territories
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="hover:text-amber-400 transition-colors">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-amber-400 transition-colors">
                  Browse by Category
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-amber-400 transition-colors">
                  Global Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Highlights */}
          <div>
            <h4 className="text-white font-serif font-semibold text-sm tracking-wider uppercase mb-4">
              Top Themes
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/destinations?category=heritage" className="hover:text-amber-400 transition-colors">
                  World Heritage Sites
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=forts" className="hover:text-amber-400 transition-colors">
                  Royal Hill Forts
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=temples" className="hover:text-amber-400 transition-colors">
                  Sacred Temples & Ghats
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=nature" className="hover:text-amber-400 transition-colors">
                  Backwaters & Wildlife
                </Link>
              </li>
              <li>
                <Link to="/destinations?category=hill-stations" className="hover:text-amber-400 transition-colors">
                  Himalayan Hill Retreats
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Admin */}
          <div>
            <h4 className="text-white font-serif font-semibold text-sm tracking-wider uppercase mb-4">
              Resources & Admin
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#about" className="hover:text-amber-400 transition-colors">
                  About the Encyclopedia
                </a>
              </li>
              <li>
                <Link to="/destinations?verified=true" className="hover:text-amber-400 transition-colors">
                  Verified Heritage Records
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  Admin & Curator Login
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-amber-400 transition-colors">
                  Curator Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} TravelBharat. Informational portal for students, researchers, and cultural enthusiasts.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">Discover India. Explore Bharat.</span>
            <span className="hidden sm:inline">|</span>
            <span className="text-slate-500">Privacy & Terms Informational Notice</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
