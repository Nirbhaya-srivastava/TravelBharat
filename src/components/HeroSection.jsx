import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Map, Sparkles, Landmark, ArrowRight } from 'lucide-react';
import SearchBar from './SearchBar.jsx';

export default function HeroSection({ stateCount = 28, utCount = 8, destinationCount = 35 }) {
  const quickSearches = ['Taj Mahal', 'Hampi', 'Kerala Backwaters', 'Jaipur', 'Varanasi', 'Kaziranga'];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-[#FAF8F5] to-[#FAF8F5] border-b border-amber-950/5">
      {/* Background ambient lighting and subtle radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-amber-300/15 via-orange-200/10 to-transparent blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/80 border border-amber-300/60 text-amber-900 text-xs font-semibold tracking-wide shadow-sm animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Digital Tourism Encyclopedia for Bharat</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Discover India, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800">
              One Destination at a Time
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            Explore the culture, heritage, nature, history and hidden gems of Bharat. Comprehensive informational guides for travelers, scholars, and cultural explorers.
          </p>

          {/* Search Bar Container */}
          <div className="pt-2 pb-1 max-w-2xl mx-auto">
            <SearchBar
              size="lg"
              placeholder="Search destinations, states, cities..."
            />
          </div>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-500">
            <span className="font-medium text-slate-600">Popular:</span>
            {quickSearches.map((term) => (
              <Link
                key={term}
                to={`/search?q=${encodeURIComponent(term)}`}
                className="px-2.5 py-1 rounded-full bg-white/80 border border-slate-200 hover:border-amber-500 hover:text-amber-800 hover:bg-amber-50/50 transition duration-150"
              >
                {term}
              </Link>
            ))}
          </div>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              to="/destinations"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition shadow-md shadow-slate-900/10 active:scale-98"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Explore Destinations</span>
              <ArrowRight className="w-4 h-4 text-slate-400 ml-1" />
            </Link>

            <Link
              to="/states"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 font-medium text-sm hover:bg-amber-50 hover:border-amber-400 hover:text-amber-900 transition shadow-sm active:scale-98"
            >
              <Map className="w-4 h-4 text-amber-700" />
              <span>Explore States & UTs</span>
            </Link>
          </div>

          {/* Dynamic Stat highlights */}
          <div className="pt-8 border-t border-slate-200/60 max-w-xl mx-auto grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-serif font-bold text-slate-900">{stateCount}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Indian States</p>
            </div>
            <div className="border-x border-slate-200">
              <p className="text-2xl font-serif font-bold text-slate-900">{utCount}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Union Territories</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-bold text-slate-900">{destinationCount}+</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Cataloged Gems</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
