import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Landmark,
  MapPin,
  Utensils,
  Sparkles,
  Mountain,
  Compass,
  ArrowLeft,
  ChevronRight,
  Tag,
  Share2,
} from 'lucide-react';
import { api } from '../services/api.js';
import DestinationCard from '../components/DestinationCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function StateDetailsPage() {
  const { stateSlug } = useParams();
  const [stateData, setStateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchState = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getStateBySlug(stateSlug);
        if (res.success && res.data) {
          setStateData(res.data);
          // Set page title for SEO
          document.title = `${res.data.name} Tourism Encyclopedia - TravelBharat`;
        } else {
          setError('State record not found in directory');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch state data');
      } finally {
        setLoading(false);
      }
    };

    fetchState();
  }, [stateSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <LoadingSpinner text={`Retrieving comprehensive records for state...`} />
      </div>
    );
  }

  if (error || !stateData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="State Not Found"
          message={error || `Could not find an encyclopedia entry for "${stateSlug}".`}
          onReset={() => window.history.back()}
          actionText="Go Back"
        />
      </div>
    );
  }

  const {
    name,
    type = 'State',
    capital,
    description,
    image,
    culture,
    cuisine,
    festivals = [],
    geography,
    destinations = [],
    cities = [],
    categories = [],
  } = stateData;

  const fallbackHero = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80';

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Header with Background Banner */}
      <div className="relative bg-slate-900 text-white min-h-[360px] sm:min-h-[420px] flex items-end">
        <img
          src={image || fallbackHero}
          alt={`Landscape of ${name}`}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-4">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-300">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link to="/states" className="hover:text-white transition">States & UTs</Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-amber-300 font-semibold">{name}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              type === 'Union Territory'
                ? 'bg-emerald-800/80 text-emerald-100 border border-emerald-400/30'
                : 'bg-amber-800/80 text-amber-100 border border-amber-400/30'
            }`}>
              {type}
            </span>
            <span className="text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-slate-100">
              {destinations.length} cataloged {destinations.length === 1 ? 'place' : 'places'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white drop-shadow-md">
            {name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
            <div className="flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>Capital: <strong className="text-white">{capital}</strong></span>
            </div>
            {cities.length > 0 && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Major Hubs: {cities.map((c) => c.name).join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Overview & Quick Facts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Comprehensive Overview */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-2xl font-serif font-bold text-slate-900">
                State Overview & Significance
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {description}
              </p>
            </div>

            {/* Geography & Cultural Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Culture */}
              {culture && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <h3 className="font-serif font-bold text-base text-slate-900">Cultural Legacy</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {culture}
                  </p>
                </div>
              )}

              {/* Geography */}
              {geography && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Mountain className="w-4 h-4 text-amber-600" />
                    <h3 className="font-serif font-bold text-base text-slate-900">Geography & Terrain</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {geography}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Cuisine & Festivals Cards */}
          <div className="space-y-6">
            {/* Cuisine Card */}
            {cuisine && (
              <div className="bg-amber-50/70 rounded-2xl p-6 border border-amber-200/70 space-y-3">
                <div className="flex items-center gap-2 text-amber-900">
                  <Utensils className="w-4 h-4 text-amber-700" />
                  <h3 className="font-serif font-bold text-base">Famous Regional Cuisine</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {cuisine}
                </p>
              </div>
            )}

            {/* Festivals Card */}
            {festivals && festivals.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h3 className="font-serif font-bold text-base">Major Festivals</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {festivals.map((fest, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg"
                    >
                      {fest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Filter by Category Quick Links */}
            {categories.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-slate-900">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <h3 className="font-serif font-bold text-base">Themes in {name}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/destinations?state=${stateSlug}&category=${cat.slug}`}
                      className="text-xs font-medium px-2.5 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg transition"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cataloged Destinations in This State */}
        <section className="space-y-6 pt-4 border-t border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-serif font-bold text-slate-900">
                Tourist Destinations in {name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Displaying {destinations.length} verified and cataloged landmarks
              </p>
            </div>

            <Link
              to={`/destinations?state=${stateSlug}`}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 hover:underline"
            >
              Filter destinations in {name} →
            </Link>
          </div>

          {destinations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-sm">
              No individual destination entries currently cataloged for {name}.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest) => (
                <DestinationCard key={dest.slug} destination={dest} />
              ))}
            </div>
          )}
        </section>

        {/* Back Link */}
        <div className="pt-4">
          <Link
            to="/states"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to all States & Union Territories</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
