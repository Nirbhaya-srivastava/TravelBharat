import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CategoryCard({ category }) {
  const { name, slug, description, image, destinationCount = 0 } = category;

  const fallback = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80';

  return (
    <Link
      to={`/categories/${slug}`}
      className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-64 flex flex-col justify-end p-5 border border-slate-200/60 transform hover:-translate-y-1"
    >
      {/* Background Image */}
      <img
        src={image || fallback}
        alt={name}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out -z-10"
        onError={(e) => {
          e.currentTarget.src = fallback;
        }}
      />

      {/* Gradient Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/20 -z-10"></div>

      {/* Top Count Badge */}
      <div className="absolute top-4 right-4">
        <span className="text-[11px] font-semibold bg-black/50 backdrop-blur-md text-amber-200 px-3 py-1 rounded-full border border-amber-300/20">
          {destinationCount} {destinationCount === 1 ? 'place' : 'places'}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-1.5 text-white">
        <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors drop-shadow">
          {name}
        </h3>
        <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="pt-2 flex items-center gap-1 text-xs font-semibold text-amber-300 group-hover:text-amber-200">
          <span>Explore Category</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
