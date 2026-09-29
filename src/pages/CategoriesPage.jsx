import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, Tag, ArrowRight, ArrowLeft } from 'lucide-react';
import { api } from '../services/api.js';
import CategoryCard from '../components/CategoryCard.jsx';
import DestinationCard from '../components/DestinationCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function CategoriesPage() {
  const { slug } = useParams();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (slug) {
          const res = await api.getCategoryBySlug(slug);
          if (res.success) {
            setActiveCategory(res.data);
            document.title = `${res.data.name} Tourism in India - TravelBharat`;
          }
        } else {
          const res = await api.getCategories();
          if (res.success) {
            setCategories(res.data);
            document.title = 'Browse Tourism Categories - TravelBharat';
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <LoadingSpinner text="Loading category encyclopedic archives..." />
      </div>
    );
  }

  // If a specific category slug was requested
  if (slug && activeCategory) {
    const { name, description, image, destinations = [] } = activeCategory;

    return (
      <div className="space-y-12 pb-16">
        {/* Category Banner */}
        <div className="relative bg-slate-900 text-white min-h-[280px] sm:min-h-[340px] flex items-end">
          <img
            src={image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1600&q=80'}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-3">
            <Link
              to="/categories"
              className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white transition font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Categories</span>
            </Link>

            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white drop-shadow">
              {name} Tourism
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {description}
            </p>

            <div className="pt-2">
              <span className="text-xs font-semibold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-slate-100">
                {destinations.length} {destinations.length === 1 ? 'place' : 'places'} documented
              </span>
            </div>
          </div>
        </div>

        {/* Destinations in this category */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <h2 className="text-2xl font-serif font-bold text-slate-900">
              Documented {name} Destinations
            </h2>
            <Link
              to={`/destinations?category=${slug}`}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 hover:underline"
            >
              Filter in main directory →
            </Link>
          </div>

          {destinations.length === 0 ? (
            <EmptyState
              title={`No Destinations Under ${name}`}
              message={`No destinations are currently listed under this category.`}
              onReset={() => window.history.back()}
              actionText="Go Back"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest) => (
                <DestinationCard key={dest.slug} destination={dest} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // All categories listing
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200/80 pb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100/70 px-3 py-1 rounded-full">
          <Tag className="w-3.5 h-3.5" />
          <span>Thematic Discovery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Tourism Categories
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
          Browse destinations across heritage, fortified citadels, pilgrimage temples, Himalayan peaks, tranquil backwaters, and wildlife sanctuaries.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.slug} category={cat} />
        ))}
      </div>
    </div>
  );
}
