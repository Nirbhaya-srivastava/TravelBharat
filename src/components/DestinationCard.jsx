import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, CheckCircle, ArrowRight } from 'lucide-react';

export default function DestinationCard({ destination }) {
  const {
    name,
    slug,
    cityName,
    stateName,
    categoryName,
    category,
    shortDescription,
    bestTimeToVisit,
    images = [],
    verified = false,
  } = destination;

  const displayImage = images && images.length > 0
    ? images[0]
    : 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80';

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-amber-500/40 shadow-sm hover:shadow-xl hover:shadow-amber-950/5 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Image Header */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

        {/* Category & Verification Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold bg-white/90 backdrop-blur-md text-slate-800 px-3 py-1 rounded-full shadow-sm capitalize">
            {categoryName || category}
          </span>
          {verified && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-900/85 backdrop-blur-md text-emerald-100 border border-emerald-400/30 px-2.5 py-1 rounded-full shadow-sm">
              <CheckCircle className="w-3 h-3 text-emerald-300" />
              <span>Verified Record</span>
            </span>
          )}
        </div>

        {/* Location pill */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1.5 text-xs text-amber-200 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{cityName}, {stateName}</span>
          </div>
        </div>
      </div>

      {/* Body content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
            <Link to={`/destinations/${slug}`} className="focus:outline-none">
              {name}
            </Link>
          </h3>

          <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
            {shortDescription}
          </p>
        </div>

        {/* Best time & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{bestTimeToVisit || 'October - March'}</span>
          </div>

          <Link
            to={`/destinations/${slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-amber-600 hover:text-white text-xs font-semibold transition-all shrink-0 active:scale-95"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}
