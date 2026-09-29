import React, { useState } from 'react';
import { Filter, RotateCcw, CheckCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

export default function FilterPanel({
  states = [],
  cities = [],
  categories = [],
  selectedState = 'all',
  selectedCity = 'all',
  selectedCategory = 'all',
  selectedSort = 'newest',
  isVerifiedOnly = false,
  searchTerm = '',
  onStateChange,
  onCityChange,
  onCategoryChange,
  onSortChange,
  onVerifiedChange,
  onSearchChange,
  onResetFilters,
  totalResults = 0,
}) {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  // Filter cities to only those in the selected state if a state is chosen
  const filteredCities = selectedState && selectedState !== 'all'
    ? cities.filter((c) => c.stateSlug === selectedState)
    : cities;

  const activeFilterCount =
    (selectedState !== 'all' ? 1 : 0) +
    (selectedCity !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (isVerifiedOnly ? 1 : 0) +
    (searchTerm ? 1 : 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 mb-8">
      {/* Header bar with counter & mobile expander */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-slate-900 text-base">Filter Encyclopedia</h3>
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-800">{totalResults}</span> {totalResults === 1 ? 'destination' : 'destinations'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100/80 px-2.5 py-1.5 rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ({activeFilterCount})</span>
            </button>
          )}

          <button
            onClick={() => setMobileExpanded(!mobileExpanded)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle filter controls"
          >
            {mobileExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Filter inputs grid */}
      <div className={`mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 ${mobileExpanded ? 'block' : 'hidden md:grid'}`}>
        {/* Search inside filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Keyword Search
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* State Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            State / UT
          </label>
          <select
            value={selectedState}
            onChange={(e) => {
              onStateChange(e.target.value);
              // Reset city when state changes
              onCityChange('all');
            }}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
          >
            <option value="all">All States & UTs</option>
            <optgroup label="States & Union Territories">
              {states.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name} ({s.destinationCount || 0})
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* City Filter (Dynamic) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            City / Region
          </label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={filteredCities.length === 0}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="all">All Cities</option>
            {filteredCities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} {selectedState === 'all' ? `(${c.stateName})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name} ({cat.destinationCount || 0})
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Sort Order
          </label>
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
          >
            <option value="newest">Featured / Newest</option>
            <option value="name-asc">Name (A to Z)</option>
            <option value="name-desc">Name (Z to A)</option>
            <option value="oldest">Historical Order</option>
          </select>
        </div>
      </div>

      {/* Verified Filter Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isVerifiedOnly}
            onChange={(e) => onVerifiedChange(e.target.checked)}
            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
          />
          <span className="text-xs font-medium text-slate-700 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Show only verified records with documented historical data
          </span>
        </label>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Live encyclopedia database
        </span>
      </div>
    </div>
  );
}
