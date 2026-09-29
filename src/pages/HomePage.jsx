import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  Shield,
  BookOpen,
  Calendar,
  Layers,
  Award,
  Trees,
  CheckCircle2,
  Mountain,
} from 'lucide-react';
import { api } from '../services/api.js';
import HeroSection from '../components/HeroSection.jsx';
import DestinationCard from '../components/DestinationCard.jsx';
import StateCard from '../components/StateCard.jsx';
import CategoryCard from '../components/CategoryCard.jsx';
import { DestinationCardSkeleton } from '../components/LoadingSpinner.jsx';

export default function HomePage() {
  const [states, setStates] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statesRes, destsRes, catsRes] = await Promise.all([
          api.getStates(),
          api.getDestinations({ limit: 12 }),
          api.getCategories(),
        ]);

        if (statesRes.success) setStates(statesRes.data);
        if (destsRes.success) setDestinations(destsRes.data);
        if (catsRes.success) setCategories(catsRes.data);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute states and UT counts dynamically
  const stateCount = states.filter((s) => s.type === 'State').length || 28;
  const utCount = states.filter((s) => s.type === 'Union Territory').length || 8;

  // Split destinations for specific sections
  const popularDestinations = destinations.slice(0, 6);
  const hiddenGems = destinations.filter((d) => d.category === 'nature' || d.category === 'hill-stations' || d.category === 'historical').slice(0, 3);
  const heritageHighlights = destinations.filter((d) => d.category === 'heritage' || d.category === 'forts').slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1 & 2. Hero Section with Search and Dynamic Counters */}
      <HeroSection
        stateCount={stateCount}
        utCount={utCount}
        destinationCount={destinations.length || 35}
      />

      {/* 3. Explore India Overview Banner */}
      <section id="explore-india" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 to-transparent pointer-events-none"></div>
          
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Bharat</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
              An Architectural & Geographical Tapestry
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              From the snow-crowned summits of the Himalayas to the tropical backwaters of Kerala, India encompasses 28 vibrant states and 8 union territories, each with distinctive dialects, classical culinary arts, and millennia of civilizational monuments.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/states"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm transition shadow-sm"
              >
                <span>Browse All States & UTs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/destinations"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition border border-white/20"
              >
                <span>Explore Destination Directory</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Popular Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Timeless Marvels</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Popular Destinations Across India
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Iconic heritage sites, royal fortresses, and world-renowned monuments.
            </p>
          </div>

          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-800 hover:text-amber-900 group"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <DestinationCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((dest) => (
              <DestinationCard key={dest.slug} destination={dest} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Explore by Category */}
      <section className="bg-amber-50/50 border-y border-amber-950/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
              Thematic Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Explore Bharat by Category
            </h2>
            <p className="text-slate-600 text-sm">
              Discover ancient temples, majestic hill forts, serene backwaters, and pristine sanctuaries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((cat) => (
              <CategoryCard key={cat.slug} category={cat} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 hover:border-amber-500 text-slate-800 font-medium text-sm hover:bg-amber-50 transition shadow-sm"
            >
              <span>View All 15 Tourism Categories</span>
              <ArrowRight className="w-4 h-4 text-amber-700" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Explore by State */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
              Regional Diversity
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
              Explore by Indian State & UT
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Discover state capitals, geography, local cuisines, and regional cultural celebrations.
            </p>
          </div>

          <Link
            to="/states"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-800 hover:text-amber-900 group"
          >
            <span>Explore All States & UTs</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {states.slice(0, 6).map((state) => (
            <StateCard key={state.slug} state={state} />
          ))}
        </div>
      </section>

      {/* 7. Hidden Gems / Serene Sanctuaries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 uppercase tracking-widest mb-1.5">
                <Trees className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hidden Gems & Sanctuaries</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Off the Beaten Path
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Lush natural reserves, tranquil backwaters, and contemplative mountain horizons.
              </p>
            </div>

            <Link
              to="/destinations?category=nature"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:text-emerald-900"
            >
              <span>Explore Nature Sanctuaries</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hiddenGems.map((dest) => (
              <DestinationCard key={dest.slug} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* 8 & 9. Cultural & Heritage + Nature & Wildlife split section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cultural & Heritage Card */}
          <div className="bg-gradient-to-br from-amber-900 to-stone-900 rounded-3xl p-8 sm:p-10 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
                <Award className="w-3.5 h-3.5" />
                <span>Living Heritage</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold leading-snug">
                Preserving Civilizational Wisdom & Stone Artistry
              </h3>
              <p className="text-amber-100/80 text-sm leading-relaxed">
                Bharat is home to 42 UNESCO World Heritage sites, showcasing the mastery of Dravidian temple stone carvers, Rajput fort architects, and ancient cave painters of Ajanta and Ellora.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Monolithic temple architecture carved top-down from living basalt rock</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Subterranean stepwells and cosmic sundials with minute accuracy</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Continuous living traditions of classical dance, music, and seasonal melas</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to="/destinations?category=heritage"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm transition"
              >
                <span>Explore World Heritage Sites</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Nature & Wildlife Card */}
          <div className="bg-gradient-to-br from-emerald-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
                <Trees className="w-3.5 h-3.5" />
                <span>Ecological Splendor</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold leading-snug">
                From Himalayan Ridges to Mangrove Deltas
              </h3>
              <p className="text-emerald-100/80 text-sm leading-relaxed">
                India contains four global biodiversity hotspots. Its conservation sanctuaries safeguard two-thirds of the world’s one-horned rhinos in Assam, Asiatic lions in Gujarat, and Royal Bengal tigers in the Sundarbans.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>High-altitude alpine lakes and rhododendron mountain trails</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tidal estuarine mangroves adapted to swimming tiger populations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Serene tropical palm-fringed lagoons and Western Ghat coffee hills</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                to="/destinations?category=wildlife"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm transition"
              >
                <span>Explore Wildlife Sanctuaries</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Travel Planning Tips */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F5F0EB] rounded-3xl p-8 sm:p-12 border border-amber-950/10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">
              Encyclopedia Guidelines
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
              Responsible Travel & Research Insights
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Essential guidance for students, researchers, and mindful cultural travelers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-slate-900 text-base">Seasonal Microclimates</h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Most plains and heritage circuits are optimal between October and March. In contrast, Himalayan regions like Ladakh, Kashmir, and Himachal flourish from May through September.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-slate-900 text-base">Sanctuary & Heritage Etiquette</h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Remove footwear before stepping onto sanctum floors or consecrated marble terraces. Respect photography restrictions at ASI active shrines and archaeological excavation sites.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-slate-900 text-base">Academic & Cultural Context</h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Every entry in TravelBharat compiles peer-reviewed regional historiography, epigraphical records, and local folklore for reliable research and discovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Call to Explore Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
          <Compass className="w-7 h-7" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          Ready to Deepen Your Knowledge of Bharat?
        </h2>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
          Start exploring state by state, filter through 15 distinct categories, or use our global keyword search to discover documented destinations.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/destinations"
            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-slate-800 transition shadow-sm"
          >
            Explore All Destinations
          </Link>
          <Link
            to="/search"
            className="px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-medium text-sm hover:bg-amber-50 transition"
          >
            Open Global Search
          </Link>
        </div>
      </section>
    </div>
  );
}
