import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';

export default function NearbyPlaces({ places = [], title = 'Nearby Attractions' }) {
  if (!places || places.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-serif font-bold text-slate-900">{title}</h3>
        <span className="text-xs text-slate-500 font-medium">In the same circuit or region</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {places.map((place, idx) => {
          const isObject = typeof place === 'object' && place !== null;
          const name = isObject ? place.name : place;
          const slug = isObject ? place.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const city = isObject ? place.cityName : '';
          const state = isObject ? place.stateName : '';
          const image = isObject && place.images && place.images[0]
            ? place.images[0]
            : 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80';

          return (
            <Link
              key={idx}
              to={`/destinations/${slug}`}
              className="group bg-white rounded-xl overflow-hidden border border-slate-200/80 hover:border-amber-500/50 shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="h-32 w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={image}
                  alt={name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                  <h4 className="font-serif font-bold text-sm leading-tight drop-shadow truncate">
                    {name}
                  </h4>
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                {city && (
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                    <span className="truncate">{city}{state ? `, ${state}` : ''}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[11px] font-semibold text-amber-800 group-hover:text-amber-700 pt-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
