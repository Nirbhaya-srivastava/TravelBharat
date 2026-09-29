import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Compass, MapPin, Tag, Landmark, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../services/api.js';
import SearchBar from '../components/SearchBar.jsx';
import DestinationCard from '../components/DestinationCard.jsx';
import StateCard from '../components/StateCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const sampleQueries = ['Taj Mahal', 'Rajasthan', 'Heritage', 'Kerala', 'Temples', 'Forts', 'Hampi', 'Kaziranga', 'Varanasi'];

  useEffect(() => {
    const executeSearch = async () => {
      if (!queryParam.trim()) {
        setResults(null);
        return;
      }

      setLoading(true);
      try {
        const res = await api.searchAll(queryParam.trim());
        if (res.success) {
          setResults(res.data);
          document.title = `Search: "${queryParam}" - TravelBharat`;
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    executeSearch();
  }, [queryParam]);

  const handleSearchSubmit = (text) => {
    if (text) {
      setSearchParams({ q: text });
    } else {
      setSearchParams({});
    }
  };

  const totalFound =
    (results?.destinations?.length || 0) +
    (results?.states?.length || 0) +
    (results?.cities?.length || 0) +
    (results?.categories?.length || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Search Bar */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100/70 px-3 py-1 rounded-full">
          <Search className="w-3.5 h-3.5" />
          <span>Global Tourism Encyclopedia Search</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Search Bharat’s Cultural Heritage
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Find monuments, states, holy shrines, sanctuaries, and regional capitals instantly.
        </p>

        <div className="pt-2">
          <SearchBar
            initialValue={queryParam}
            onSearch={handleSearchSubmit}
            size="lg"
            placeholder="Try searching 'Taj Mahal', 'Rajasthan', 'Hampi', or 'Heritage'..."
          />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-1">
          <span className="text-slate-500 font-medium">Quick Searches:</span>
          {sampleQueries.map((term) => (
            <button
              key={term}
              onClick={() => handleSearchSubmit(term)}
              className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-amber-500 hover:text-amber-800 hover:bg-amber-50 transition shadow-xs"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && <LoadingSpinner text={`Searching encyclopedia entries for "${queryParam}"...`} />}

      {/* When no query is entered yet */}
      {!loading && !queryParam && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-xl text-slate-900">Start Your Exploration</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Enter a destination name (e.g. <em>Amer Fort</em>), state (e.g. <em>Uttar Pradesh</em>), city (e.g. <em>Varanasi</em>), or category (e.g. <em>Beaches</em>) to search the digital archives.
          </p>
        </div>
      )}

      {/* When query is entered and results received */}
      {!loading && queryParam && results && (
        <div className="space-y-12">
          {/* Results Summary Banner */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <div>
              <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Search Results</p>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
                Found {totalFound} records for "{queryParam}"
              </h2>
            </div>
            {totalFound > 0 && (
              <button
                onClick={() => handleSearchSubmit('')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Clear Search
              </button>
            )}
          </div>

          {totalFound === 0 ? (
            <EmptyState
              title="No Results Found"
              message={`We couldn’t find any destinations, states, or categories matching "${queryParam}". Please verify spelling or try another term.`}
              onReset={() => handleSearchSubmit('')}
              actionText="Reset Search"
            />
          ) : (
            <div className="space-y-12">
              {/* Matched States */}
              {results.states && results.states.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Landmark className="w-5 h-5 text-amber-700" />
                    <h3 className="text-xl font-serif font-bold text-slate-900">
                      States & Union Territories ({results.states.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.states.map((st) => (
                      <StateCard key={st.slug} state={st} />
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Categories */}
              {results.categories && results.categories.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-amber-700" />
                    <h3 className="text-xl font-serif font-bold text-slate-900">
                      Matching Categories ({results.categories.length})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {results.categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/categories/${cat.slug}`}
                        className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-50 text-slate-800 text-sm font-semibold transition flex items-center gap-2 shadow-xs"
                      >
                        <span>{cat.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Destinations */}
              {results.destinations && results.destinations.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-700" />
                    <h3 className="text-xl font-serif font-bold text-slate-900">
                      Destinations ({results.destinations.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.destinations.map((dest) => (
                      <DestinationCard key={dest.slug} destination={dest} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
