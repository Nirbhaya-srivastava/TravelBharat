import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Sparkles, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { api } from '../services/api.js';
import DestinationCard from '../components/DestinationCard.jsx';
import FilterPanel from '../components/FilterPanel.jsx';
import LoadingSpinner, { DestinationCardSkeleton } from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function DestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [destinations, setDestinations] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Read URL query params
  const stateParam = searchParams.get('state') || 'all';
  const cityParam = searchParams.get('city') || 'all';
  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = searchParams.get('sort') || 'newest';
  const verifiedParam = searchParams.get('verified') === 'true';
  const searchParam = searchParams.get('search') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // Initial metadata fetch for filter dropdowns
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [statesRes, citiesRes, catsRes] = await Promise.all([
          api.getStates(),
          api.getCities(),
          api.getCategories(),
        ]);
        if (statesRes.success) setStates(statesRes.data);
        if (citiesRes.success) setCities(citiesRes.data);
        if (catsRes.success) setCategories(catsRes.data);
      } catch (err) {
        console.error('Failed to load filter metadata:', err);
      }
    };
    fetchMetadata();
  }, []);

  // Fetch destinations whenever filter query params change
  const fetchDestinations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getDestinations({
        state: stateParam !== 'all' ? stateParam : undefined,
        city: cityParam !== 'all' ? cityParam : undefined,
        category: categoryParam !== 'all' ? categoryParam : undefined,
        sort: sortParam,
        verified: verifiedParam ? 'true' : undefined,
        search: searchParam || undefined,
        page: pageParam,
        limit: 12,
      });

      if (res.success) {
        setDestinations(res.data);
        setTotalCount(res.total);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      console.error('Failed to load destinations:', err);
    } finally {
      setLoading(false);
    }
  }, [stateParam, cityParam, categoryParam, sortParam, verifiedParam, searchParam, pageParam]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  // Update query params helper
  const updateQueryParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all' && value !== false) {
      newParams.set(key, String(value));
    } else {
      newParams.delete(key);
    }
    // Always reset page to 1 when filters change
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', String(newPage));
      setSearchParams(newParams);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100/70 px-3 py-1 rounded-full">
          <Compass className="w-3.5 h-3.5" />
          <span>Complete Destination Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Destinations of India
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
          Search and filter across India’s timeless heritage monuments, hill forts, spiritual sanctums, coastal beaches, and wild reserves.
        </p>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        states={states}
        cities={cities}
        categories={categories}
        selectedState={stateParam}
        selectedCity={cityParam}
        selectedCategory={categoryParam}
        selectedSort={sortParam}
        isVerifiedOnly={verifiedParam}
        searchTerm={searchParam}
        onStateChange={(val) => updateQueryParam('state', val)}
        onCityChange={(val) => updateQueryParam('city', val)}
        onCategoryChange={(val) => updateQueryParam('category', val)}
        onSortChange={(val) => updateQueryParam('sort', val)}
        onVerifiedChange={(val) => updateQueryParam('verified', val)}
        onSearchChange={(val) => updateQueryParam('search', val)}
        onResetFilters={handleResetFilters}
        totalResults={totalCount}
      />

      {/* Destination Grid or Empty/Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <DestinationCardSkeleton key={i} />
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <EmptyState
          title="No Matching Destinations Found"
          message="No records matched your selected state, city, category, or search keywords."
          onReset={handleResetFilters}
          actionText="Clear All Filters"
        />
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest.slug} destination={dest} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200/80 pt-6">
              <p className="text-xs text-slate-500">
                Page <span className="font-semibold text-slate-900">{pageParam}</span> of{' '}
                <span className="font-semibold text-slate-900">{totalPages}</span> ({totalCount} total destinations)
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pageParam - 1)}
                  disabled={pageParam === 1}
                  className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => handlePageChange(num)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                        num === pageParam
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pageParam + 1)}
                  disabled={pageParam === totalPages}
                  className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition shadow-sm"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
