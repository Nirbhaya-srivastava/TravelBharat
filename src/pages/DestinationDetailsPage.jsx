import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  Ticket,
  Plane,
  Train,
  Car,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BookOpen,
  Compass,
  ArrowLeft,
  Share2,
  Lightbulb,
} from 'lucide-react';
import { api } from '../services/api.js';
import ImageGallery from '../components/ImageGallery.jsx';
import NearbyPlaces from '../components/NearbyPlaces.jsx';
import DestinationCard from '../components/DestinationCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function DestinationDetailsPage() {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getDestinationBySlug(slug);
        if (res.success && res.data) {
          setDestination(res.data);
          document.title = `${res.data.name} (${res.data.cityName}, ${res.data.stateName}) - TravelBharat`;
        } else {
          setError('Destination entry not found');
        }
      } catch (err) {
        setError(err.message || 'Failed to load destination entry');
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <LoadingSpinner text="Retrieving detailed encyclopedia folio..." />
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          title="Destination Folio Not Found"
          message={error || `Could not find an entry for "${slug}".`}
          onReset={() => window.history.back()}
          actionText="Go Back"
        />
      </div>
    );
  }

  const {
    name,
    state,
    stateName,
    city,
    cityName,
    category,
    categoryName,
    shortDescription,
    description,
    historicalSignificance,
    culturalSignificance,
    bestTimeToVisit,
    recommendedDuration,
    openingHours,
    entryFee,
    location,
    mapUrl,
    images = [],
    nearbyPlaces = [],
    travelTips = [],
    howToReach,
    verified,
    relatedDestinations = [],
  } = destination;

  // Fallback map URL if not present
  const googleMapsUrl = mapUrl || `https://maps.google.com/?q=${encodeURIComponent(`${name}, ${cityName}, ${stateName}, India`)}`;

  return (
    <div className="space-y-10 pb-20">
      {/* Top Breadcrumb & Metadata Action Bar */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-amber-800 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link to="/states" className="hover:text-amber-800 transition">States</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link to={`/states/${state}`} className="hover:text-amber-800 transition">{stateName}</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500">{cityName}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-900 font-semibold">{name}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              title="Copy link to folio"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share Entry'}</span>
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>View on Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title Header with Category & Verification */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/destinations?category=${category}`}
              className="text-xs font-semibold bg-amber-100/90 text-amber-900 hover:bg-amber-200 px-3 py-1 rounded-full transition capitalize"
            >
              {categoryName || category}
            </Link>

            {verified && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300/80 px-3 py-1 rounded-full">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified Historical Record</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-slate-900 tracking-tight leading-tight">
            {name}
          </h1>

          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{cityName}, {stateName}</span>
          </div>

          <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed max-w-4xl pt-1">
            {shortDescription}
          </p>
        </div>

        {/* 15. Image Gallery Component */}
        <section className="space-y-3">
          <ImageGallery images={images} destinationName={name} />
        </section>

        {/* Core Encyclopedia Grid: Overview & Practical Facts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Main Encyclopedic Folio */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900">
                <BookOpen className="w-5 h-5 text-amber-600" />
                <h2 className="text-2xl font-serif font-bold">Monograph & Architecture</h2>
              </div>
              <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4">
                {description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Historical Significance */}
            {historicalSignificance && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-900">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h3 className="text-2xl font-serif font-bold text-slate-900">Historical Significance</h3>
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  {historicalSignificance}
                </p>
              </div>
            )}

            {/* Cultural Significance */}
            {culturalSignificance && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-indigo-900">
                  <Compass className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-2xl font-serif font-bold text-slate-900">Cultural & Spiritual Resonance</h3>
                </div>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                  {culturalSignificance}
                </p>
              </div>
            )}

            {/* 17. Travel Tips */}
            {travelTips && travelTips.length > 0 && (
              <div className="bg-amber-50/60 rounded-3xl p-6 sm:p-8 border border-amber-200/80 space-y-4">
                <div className="flex items-center gap-2 text-amber-900">
                  <Lightbulb className="w-5 h-5 text-amber-700" />
                  <h3 className="text-2xl font-serif font-bold text-slate-900">Curator Travel Tips</h3>
                </div>
                <ul className="space-y-2.5">
                  {travelTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 18. How to Reach */}
            {howToReach && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
                <h3 className="text-2xl font-serif font-bold text-slate-900">How to Reach</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {howToReach.air && (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Plane className="w-4 h-4 text-amber-600" />
                        <span>By Air</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{howToReach.air}</p>
                    </div>
                  )}

                  {howToReach.train && (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Train className="w-4 h-4 text-amber-600" />
                        <span>By Rail</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{howToReach.train}</p>
                    </div>
                  )}

                  {howToReach.road && (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Car className="w-4 h-4 text-amber-600" />
                        <span>By Road</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{howToReach.road}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Quick Reference Facts Sheet */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5 sticky top-24">
              <h3 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
                Key Visitor Information
              </h3>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Best time */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase font-bold text-slate-400">Best Time to Visit</span>
                    <span className="text-slate-800 font-medium">{bestTimeToVisit || 'October - March'}</span>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase font-bold text-slate-400">Visiting Timings</span>
                    <span className="text-slate-800 font-medium">{openingHours || 'Sunrise to Sunset'}</span>
                  </div>
                </div>

                {/* Entry Fee */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase font-bold text-slate-400">Entry Fee Structure</span>
                    <span className="text-slate-800 font-medium">{entryFee || 'Informational: Free or standard ticketing'}</span>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase font-bold text-slate-400">Recommended Duration</span>
                    <span className="text-slate-800 font-medium">{recommendedDuration || '2-3 hours'}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] uppercase font-bold text-slate-400">Exact Location</span>
                    <span className="text-slate-800 font-medium">{location}</span>
                  </div>
                </div>
              </div>

              {/* Map CTA Button */}
              <div className="pt-3 border-t border-slate-100">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition shadow-sm"
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 16. Nearby Attractions */}
        {nearbyPlaces && nearbyPlaces.length > 0 && (
          <section className="pt-6 border-t border-slate-200/80">
            <NearbyPlaces places={nearbyPlaces} title="Nearby Attractions & Circuits" />
          </section>
        )}

        {/* 19. Related Destinations in Same Category */}
        {relatedDestinations && relatedDestinations.length > 0 && (
          <section className="space-y-6 pt-6 border-t border-slate-200/80">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-serif font-bold text-slate-900">
                More in {categoryName || category}
              </h3>
              <Link
                to={`/destinations?category=${category}`}
                className="text-xs font-semibold text-amber-800 hover:text-amber-900 hover:underline"
              >
                View all {categoryName || category} sites →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedDestinations.map((rel) => (
                <DestinationCard key={rel.slug} destination={rel} />
              ))}
            </div>
          </section>
        )}

        {/* Return Button */}
        <div className="pt-8">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Destination Directory</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
