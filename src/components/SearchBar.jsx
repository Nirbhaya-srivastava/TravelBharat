import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';

export default function SearchBar({
  placeholder = 'Search destinations, states, cities...',
  initialValue = '',
  onSearch,
  className = '',
  size = 'md', // 'sm' | 'md' | 'lg'
}) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (onSearch) {
      onSearch(trimmed);
    } else if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  const sizeClasses = {
    sm: 'py-2 px-3 text-xs',
    md: 'py-3 px-4 text-sm',
    lg: 'py-4 px-5 text-base',
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center w-full bg-white rounded-2xl border border-amber-900/20 shadow-lg shadow-amber-900/5 hover:border-amber-600/40 focus-within:border-amber-600 focus-within:ring-4 focus-within:ring-amber-500/10 transition-all ${className}`}
    >
      <div className="pl-4 text-amber-700 pointer-events-none">
        <Search className={size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none ${sizeClasses[size]}`}
      />

      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="p-1 mr-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <button
        type="submit"
        className="mr-2 my-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium text-sm hover:from-amber-700 hover:to-amber-800 transition shadow-sm hover:shadow flex items-center gap-1.5 shrink-0"
      >
        <span>Search</span>
        <ArrowRight className="w-4 h-4 hidden sm:inline" />
      </button>
    </form>
  );
}
