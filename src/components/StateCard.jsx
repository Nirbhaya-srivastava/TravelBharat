import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Landmark, ArrowUpRight } from 'lucide-react';

export default function StateCard({ state }) {
  const {
    name,
    slug,
    capital,
    type = 'State',
    description,
    image,
    destinationCount = 0,
  } = state;

  const fallbackImage = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80';

  return (
    <Link
      to={`/states/${slug}`}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-amber-500/50 shadow-sm hover:shadow-xl hover:shadow-amber-950/5 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
    >
      {/* Image Header with Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={image || fallbackImage}
          alt={`Landscape of ${name}`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-sm ${
            type === 'Union Territory'
              ? 'bg-emerald-900/80 text-emerald-100 border border-emerald-500/30'
              : 'bg-amber-900/80 text-amber-100 border border-amber-500/30'
          }`}>
            {type}
          </span>
          <span className="text-[11px] font-medium bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/20">
            {destinationCount} {destinationCount === 1 ? 'place' : 'places'}
          </span>
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-xl font-serif font-bold group-hover:text-amber-300 transition-colors drop-shadow-sm">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-amber-100/90 font-medium mt-0.5">
            <Landmark className="w-3.5 h-3.5 text-amber-300" />
            <span>Capital: {capital}</span>
          </div>
        </div>
      </div>

      {/* Description & Action */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
          {description || `Discover the iconic cultural sites, history, and geographical marvels of ${name}.`}
        </p>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-800 group-hover:text-amber-700">
          <span>Explore State Encyclopedia</span>
          <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
