import React, { useEffect, useState } from 'react';
import { MapPin, Search, Landmark, Compass, RotateCcw } from 'lucide-react';
import { api } from '../services/api.js';
import StateCard from '../components/StateCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function StatesPage() {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'State' | 'Union Territory'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.getStates();
        if (res.success) {
          setStates(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch states:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, []);

  const filteredStates = states.filter((s) => {
    const matchesType = filterType === 'all' || s.type === filterType;
    const matchesSearch =
      !searchTerm.trim() ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      s.capital.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      (s.description && s.description.toLowerCase().includes(searchTerm.toLowerCase().trim()));
    return matchesType && matchesSearch;
  });

  const stateCount = states.filter((s) => s.type === 'State').length;
  const utCount = states.filter((s) => s.type === 'Union Territory').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200/80 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100/70 px-3 py-1 rounded-full">
          <Compass className="w-3.5 h-3.5" />
          <span>Sovereign Territory of Bharat</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Indian States & Union Territories
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          Explore the geographical divisions of India. Each state and union territory features unique governance, capitals, regional customs, traditional cuisines, and cataloged heritage destinations.
        </p>
      </div>

      {/* Control bar: Type filter & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        {/* Type selector tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Territories ({states.length})
          </button>
          <button
            onClick={() => setFilterType('State')}
            className={`flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition ${
              filterType === 'State'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            States ({stateCount})
          </button>
          <button
            onClick={() => setFilterType('Union Territory')}
            className={`flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition ${
              filterType === 'Union Territory'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Union Territories ({utCount})
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search state or capital..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Content state */}
      {loading ? (
        <LoadingSpinner text="Compiling state encyclopedia records..." />
      ) : filteredStates.length === 0 ? (
        <EmptyState
          title="No States Match Your Criteria"
          message={`No territories found matching "${searchTerm}". Try adjusting your keyword or reset filters.`}
          onReset={() => {
            setFilterType('all');
            setSearchTerm('');
          }}
          actionText="Clear State Filters"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStates.map((state) => (
            <StateCard key={state.slug} state={state} />
          ))}
        </div>
      )}
    </div>
  );
}
