import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Layers,
  MapPin,
  Landmark,
  Tag,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  X,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function AdminDashboardPage() {
  const { admin, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('destinations'); // 'overview' | 'destinations' | 'states' | 'cities' | 'categories'
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Collections state
  const [destinations, setDestinations] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

  // Search filter inside admin tables
  const [tableSearch, setTableSearch] = useState('');

  // Modal State for Editing / Creating
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('destination'); // 'destination' | 'state' | 'city' | 'category'
  const [modalItem, setModalItem] = useState(null); // null = new, object = edit

  // Destination Form State
  const [destForm, setDestForm] = useState({
    name: '',
    state: '',
    city: '',
    category: '',
    shortDescription: '',
    description: '',
    historicalSignificance: '',
    culturalSignificance: '',
    bestTimeToVisit: 'October - March',
    recommendedDuration: '2-3 hours',
    openingHours: 'Sunrise to Sunset',
    entryFee: 'Free entry',
    location: '',
    mapUrl: '',
    imagesText: '',
    nearbyText: '',
    travelTipsText: '',
    airReach: '',
    trainReach: '',
    roadReach: '',
    verified: false,
    status: 'published',
  });

  // State Form State
  const [stateForm, setStateForm] = useState({
    name: '',
    type: 'State',
    capital: '',
    description: '',
    image: '',
    culture: '',
    cuisine: '',
    festivals: '',
    geography: '',
  });

  // City Form State
  const [cityForm, setCityForm] = useState({
    name: '',
    stateSlug: '',
    description: '',
    image: '',
  });

  // Category Form State
  const [catForm, setCatForm] = useState({
    name: '',
    description: '',
    image: '',
  });

  // Fetch all admin data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, destRes, stateRes, cityRes, catRes] = await Promise.all([
        api.getAdminDashboard(),
        api.getDestinations({ limit: 100, includeDrafts: 'true' }),
        api.getStates(),
        api.getCities(),
        api.getCategories(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (destRes.success) setDestinations(destRes.data);
      if (stateRes.success) setStates(stateRes.data);
      if (cityRes.success) setCities(cityRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      setActionError(err.message || 'Failed to retrieve administrative records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showToast = (msg, isErr = false) => {
    if (isErr) {
      setActionError(msg);
      setTimeout(() => setActionError(''), 4000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(''), 4000);
    }
  };

  // Open Add Modal
  const handleOpenAdd = (type) => {
    setModalType(type);
    setModalItem(null);
    if (type === 'destination') {
      setDestForm({
        name: '',
        state: states[0]?.slug || '',
        city: cities[0]?.slug || '',
        category: categories[0]?.slug || '',
        shortDescription: '',
        description: '',
        historicalSignificance: '',
        culturalSignificance: '',
        bestTimeToVisit: 'October - March',
        recommendedDuration: '2-3 hours',
        openingHours: 'Sunrise to Sunset',
        entryFee: 'Free entry',
        location: '',
        mapUrl: '',
        imagesText: '',
        nearbyText: '',
        travelTipsText: '',
        airReach: '',
        trainReach: '',
        roadReach: '',
        verified: false,
        status: 'published',
      });
    } else if (type === 'state') {
      setStateForm({
        name: '',
        type: 'State',
        capital: '',
        description: '',
        image: '',
        culture: '',
        cuisine: '',
        festivals: '',
        geography: '',
      });
    } else if (type === 'city') {
      setCityForm({
        name: '',
        stateSlug: states[0]?.slug || '',
        description: '',
        image: '',
      });
    } else if (type === 'category') {
      setCatForm({
        name: '',
        description: '',
        image: '',
      });
    }
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (type, item) => {
    setModalType(type);
    setModalItem(item);

    if (type === 'destination') {
      setDestForm({
        name: item.name || '',
        state: item.state || states[0]?.slug || '',
        city: item.city || cities[0]?.slug || '',
        category: item.category || categories[0]?.slug || '',
        shortDescription: item.shortDescription || '',
        description: item.description || '',
        historicalSignificance: item.historicalSignificance || '',
        culturalSignificance: item.culturalSignificance || '',
        bestTimeToVisit: item.bestTimeToVisit || 'October - March',
        recommendedDuration: item.recommendedDuration || '2-3 hours',
        openingHours: item.openingHours || 'Sunrise to Sunset',
        entryFee: item.entryFee || 'Free entry',
        location: item.location || '',
        mapUrl: item.mapUrl || '',
        imagesText: Array.isArray(item.images) ? item.images.join('\n') : '',
        nearbyText: Array.isArray(item.nearbyAttractions) ? item.nearbyAttractions.join(', ') : '',
        travelTipsText: Array.isArray(item.travelTips) ? item.travelTips.join('\n') : '',
        airReach: item.howToReach?.air || '',
        trainReach: item.howToReach?.train || '',
        roadReach: item.howToReach?.road || '',
        verified: Boolean(item.verified),
        status: item.status || 'published',
      });
    } else if (type === 'state') {
      setStateForm({
        name: item.name || '',
        type: item.type || 'State',
        capital: item.capital || '',
        description: item.description || '',
        image: item.image || '',
        culture: item.culture || '',
        cuisine: item.cuisine || '',
        festivals: Array.isArray(item.festivals) ? item.festivals.join(', ') : (item.festivals || ''),
        geography: item.geography || '',
      });
    } else if (type === 'city') {
      setCityForm({
        name: item.name || '',
        stateSlug: item.stateSlug || '',
        description: item.description || '',
        image: item.image || '',
      });
    } else if (type === 'category') {
      setCatForm({
        name: item.name || '',
        description: item.description || '',
        image: item.image || '',
      });
    }
    setModalOpen(true);
  };

  // Submit modal form
  const handleSaveModal = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'destination') {
        const payload = {
          name: destForm.name,
          state: destForm.state,
          city: destForm.city,
          category: destForm.category,
          shortDescription: destForm.shortDescription,
          description: destForm.description,
          historicalSignificance: destForm.historicalSignificance,
          culturalSignificance: destForm.culturalSignificance,
          bestTimeToVisit: destForm.bestTimeToVisit,
          recommendedDuration: destForm.recommendedDuration,
          openingHours: destForm.openingHours,
          entryFee: destForm.entryFee,
          location: destForm.location,
          mapUrl: destForm.mapUrl,
          images: destForm.imagesText.split('\n').map((s) => s.trim()).filter(Boolean),
          nearbyAttractions: destForm.nearbyText.split(',').map((s) => s.trim()).filter(Boolean),
          travelTips: destForm.travelTipsText.split('\n').map((s) => s.trim()).filter(Boolean),
          howToReach: {
            air: destForm.airReach,
            train: destForm.trainReach,
            road: destForm.roadReach,
          },
          verified: destForm.verified,
          status: destForm.status,
        };

        if (modalItem) {
          const res = await api.updateDestination(modalItem._id || modalItem.id, payload);
          if (res.success) showToast(`Destination '${payload.name}' updated!`);
        } else {
          const res = await api.createDestination(payload);
          if (res.success) showToast(`Destination '${payload.name}' created!`);
        }
      } else if (modalType === 'state') {
        const payload = {
          ...stateForm,
          festivals: stateForm.festivals.split(',').map((s) => s.trim()).filter(Boolean),
        };
        if (modalItem) {
          await api.updateState(modalItem._id || modalItem.id, payload);
          showToast(`State '${payload.name}' updated!`);
        } else {
          await api.createState(payload);
          showToast(`State '${payload.name}' created!`);
        }
      } else if (modalType === 'city') {
        if (modalItem) {
          await api.updateCity(modalItem._id || modalItem.id, cityForm);
          showToast(`City '${cityForm.name}' updated!`);
        } else {
          await api.createCity(cityForm);
          showToast(`City '${cityForm.name}' created!`);
        }
      } else if (modalType === 'category') {
        if (modalItem) {
          await api.updateCategory(modalItem._id || modalItem.id, catForm);
          showToast(`Category '${catForm.name}' updated!`);
        } else {
          await api.createCategory(catForm);
          showToast(`Category '${catForm.name}' created!`);
        }
      }

      setModalOpen(false);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Operation failed', true);
    }
  };

  // Delete Handlers
  const handleDelete = async (type, id, name) => {
    if (!window.confirm(`Are you sure you want to remove '${name}' from the encyclopedia?`)) return;

    try {
      if (type === 'destination') await api.deleteDestination(id);
      if (type === 'state') await api.deleteState(id);
      if (type === 'city') await api.deleteCity(id);
      if (type === 'category') await api.deleteCategory(id);

      showToast(`Removed '${name}' successfully`);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Delete failed', true);
    }
  };

  // Toggle quick verification
  const handleToggleVerified = async (dest) => {
    try {
      const newStatus = !dest.verified;
      await api.updateDestination(dest._id || dest.id, {
        verified: newStatus,
        status: newStatus ? 'verified' : dest.status === 'draft' ? 'draft' : 'published',
      });
      showToast(`Updated verification status for '${dest.name}'`);
      loadAllData();
    } catch (err) {
      showToast(err.message || 'Toggle failed', true);
    }
  };

  if (loading && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <LoadingSpinner text="Connecting to encyclopedia curator dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast banners */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-widest">
            <Shield className="w-4 h-4 text-amber-700" />
            <span>Administrative Console</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1">
            Encyclopedia Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Welcome, <strong>{admin?.name}</strong> ({admin?.role}) · Manage states, cities, categories, and destinations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllData}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
            title="Refresh database records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
          >
            View Public Site
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">States & UTs</span>
              <Landmark className="w-4 h-4 text-amber-700" />
            </div>
            <p className="text-3xl font-serif font-bold text-slate-900">{stats.totalStates}</p>
            <p className="text-[11px] text-slate-500">Cataloged divisions</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Cities / Hubs</span>
              <MapPin className="w-4 h-4 text-indigo-700" />
            </div>
            <p className="text-3xl font-serif font-bold text-slate-900">{stats.totalCities}</p>
            <p className="text-[11px] text-slate-500">Regional centers</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Destinations</span>
              <Layers className="w-4 h-4 text-emerald-700" />
            </div>
            <p className="text-3xl font-serif font-bold text-slate-900">{stats.totalDestinations}</p>
            <p className="text-[11px] text-slate-500">{stats.publishedCount} published, {stats.draftCount} drafts</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Categories</span>
              <Tag className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-3xl font-serif font-bold text-slate-900">{stats.totalCategories}</p>
            <p className="text-[11px] text-slate-500">Tourism themes</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Verified</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-3xl font-serif font-bold text-emerald-700">{stats.verifiedCount}</p>
            <p className="text-[11px] text-slate-500">Historically authenticated</p>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'destinations'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Destinations ({destinations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('states')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'states'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>States & UTs ({states.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cities')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cities'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Cities ({cities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Categories ({categories.length})</span>
          </button>
        </div>

        {/* Action Button to Add New Item */}
        <button
          onClick={() => {
            if (activeTab === 'destinations') handleOpenAdd('destination');
            else if (activeTab === 'states') handleOpenAdd('state');
            else if (activeTab === 'cities') handleOpenAdd('city');
            else if (activeTab === 'categories') handleOpenAdd('category');
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition shadow-sm self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {activeTab.slice(0, -1)}</span>
        </button>
      </div>

      {/* Table Filter Input */}
      <div className="relative max-w-sm">
        <input
          type="text"
          value={tableSearch}
          onChange={(e) => setTableSearch(e.target.value)}
          placeholder={`Filter ${activeTab}...`}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
      </div>

      {/* TAB 1: Destinations Table */}
      {activeTab === 'destinations' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Destination</th>
                  <th className="p-4">State & City</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Verified</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {destinations
                  .filter((d) =>
                    !tableSearch ||
                    d.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
                    d.stateName.toLowerCase().includes(tableSearch.toLowerCase()) ||
                    d.cityName.toLowerCase().includes(tableSearch.toLowerCase())
                  )
                  .map((dest) => (
                    <tr key={dest._id || dest.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={dest.images && dest.images[0] ? dest.images[0] : 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=100&q=80'}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div>
                            <span className="font-serif font-bold text-sm block">{dest.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">/{dest.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-medium text-slate-800">{dest.cityName}</span>
                        <span className="text-slate-400 block text-[11px]">{dest.stateName}</span>
                      </td>

                      <td className="p-4">
                        <span className="capitalize px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                          {dest.categoryName || dest.category}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase ${
                          dest.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : dest.status === 'draft'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {dest.status || 'published'}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleToggleVerified(dest)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                            dest.verified
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>{dest.verified ? 'Verified' : 'Unverified'}</span>
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/destinations/${dest.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                            title="Preview Public Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit('destination', dest)}
                            className="p-1.5 text-amber-700 hover:text-amber-900 rounded-lg hover:bg-amber-50"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete('destination', dest._id || dest.id, dest.name)}
                            className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: States Table */}
      {activeTab === 'states' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">State / Territory</th>
                  <th className="p-4">Capital</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Destinations</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {states
                  .filter((s) => !tableSearch || s.name.toLowerCase().includes(tableSearch.toLowerCase()))
                  .map((st) => (
                    <tr key={st._id || st.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={st.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=100&q=80'}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div>
                            <span className="font-serif font-bold text-sm block">{st.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">/{st.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-800">{st.capital}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800">
                          {st.type || 'State'}
                        </span>
                      </td>
                      <td className="p-4">{st.destinationCount || 0} places</td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/states/${st.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                            title="Preview Public Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit('state', st)}
                            className="p-1.5 text-amber-700 hover:text-amber-900 rounded-lg hover:bg-amber-50"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete('state', st._id || st.id, st.name)}
                            className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Cities Table */}
      {activeTab === 'cities' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">City</th>
                  <th className="p-4">State</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cities
                  .filter((c) => !tableSearch || c.name.toLowerCase().includes(tableSearch.toLowerCase()))
                  .map((ct) => (
                    <tr key={ct._id || ct.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 font-serif font-bold text-sm text-slate-900">{ct.name}</td>
                      <td className="p-4 font-medium text-slate-800">{ct.stateName}</td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">{ct.description}</td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit('city', ct)}
                            className="p-1.5 text-amber-700 hover:text-amber-900 rounded-lg hover:bg-amber-50"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete('city', ct._id || ct.id, ct.name)}
                            className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Categories Table */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Category</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Count</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories
                  .filter((cat) => !tableSearch || cat.name.toLowerCase().includes(tableSearch.toLowerCase()))
                  .map((cat) => (
                    <tr key={cat._id || cat.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4 font-serif font-bold text-sm text-slate-900">{cat.name}</td>
                      <td className="p-4 font-mono text-slate-400">/{cat.slug}</td>
                      <td className="p-4 text-slate-500 max-w-sm truncate">{cat.description}</td>
                      <td className="p-4 font-semibold">{cat.destinationCount || 0}</td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit('category', cat)}
                            className="p-1.5 text-amber-700 hover:text-amber-900 rounded-lg hover:bg-amber-50"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete('category', cat._id || cat.id, cat.name)}
                            className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD MODAL FOR ADD / EDIT */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-slate-900">
                  {modalItem ? 'Edit' : 'Add New'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in authentic encyclopedia details and historical background.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM BODY */}
            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* Destination Form */}
              {modalType === 'destination' && (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Destination Name *</label>
                      <input
                        type="text"
                        required
                        value={destForm.name}
                        onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                        placeholder="e.g. Taj Mahal"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Category *</label>
                      <select
                        required
                        value={destForm.category}
                        onChange={(e) => setDestForm({ ...destForm, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      >
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">State *</label>
                      <select
                        required
                        value={destForm.state}
                        onChange={(e) => setDestForm({ ...destForm, state: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      >
                        {states.map((s) => (
                          <option key={s.slug} value={s.slug}>{s.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">City *</label>
                      <select
                        required
                        value={destForm.city}
                        onChange={(e) => setDestForm({ ...destForm, city: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      >
                        {cities.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.name} ({c.stateName})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Short Summary *</label>
                    <input
                      type="text"
                      required
                      value={destForm.shortDescription}
                      onChange={(e) => setDestForm({ ...destForm, shortDescription: e.target.value })}
                      placeholder="Concise 1-2 sentence description..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Full Description & Architecture *</label>
                    <textarea
                      required
                      rows={3}
                      value={destForm.description}
                      onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                      placeholder="Detailed monograph..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Historical Significance</label>
                      <textarea
                        rows={2}
                        value={destForm.historicalSignificance}
                        onChange={(e) => setDestForm({ ...destForm, historicalSignificance: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      ></textarea>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Cultural Significance</label>
                      <textarea
                        rows={2}
                        value={destForm.culturalSignificance}
                        onChange={(e) => setDestForm({ ...destForm, culturalSignificance: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      ></textarea>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Best Time to Visit</label>
                      <input
                        type="text"
                        value={destForm.bestTimeToVisit}
                        onChange={(e) => setDestForm({ ...destForm, bestTimeToVisit: e.target.value })}
                        placeholder="e.g. October - March"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Entry Fee Info</label>
                      <input
                        type="text"
                        value={destForm.entryFee}
                        onChange={(e) => setDestForm({ ...destForm, entryFee: e.target.value })}
                        placeholder="e.g. ₹50 Indians, ₹1100 Foreigners"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Timings / Hours</label>
                      <input
                        type="text"
                        value={destForm.openingHours}
                        onChange={(e) => setDestForm({ ...destForm, openingHours: e.target.value })}
                        placeholder="e.g. 6:00 AM - 6:00 PM"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Exact Location Address *</label>
                      <input
                        type="text"
                        required
                        value={destForm.location}
                        onChange={(e) => setDestForm({ ...destForm, location: e.target.value })}
                        placeholder="City, State, Postal Pin..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Google Maps URL (Optional)</label>
                      <input
                        type="url"
                        value={destForm.mapUrl}
                        onChange={(e) => setDestForm({ ...destForm, mapUrl: e.target.value })}
                        placeholder="https://maps.google.com/?q=..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Image URLs (One per line)</label>
                    <textarea
                      rows={2}
                      value={destForm.imagesText}
                      onChange={(e) => setDestForm({ ...destForm, imagesText: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Nearby Attractions (Comma-separated)</label>
                      <input
                        type="text"
                        value={destForm.nearbyText}
                        onChange={(e) => setDestForm({ ...destForm, nearbyText: e.target.value })}
                        placeholder="e.g. Agra Fort, Mehtab Bagh"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Travel Tips (One per line)</label>
                      <textarea
                        rows={2}
                        value={destForm.travelTipsText}
                        onChange={(e) => setDestForm({ ...destForm, travelTipsText: e.target.value })}
                        placeholder="Arrive early at sunrise..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      ></textarea>
                    </div>
                  </div>

                  {/* Status & Verification moderation */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 mr-2">Publication Status:</label>
                        <select
                          value={destForm.status}
                          onChange={(e) => setDestForm({ ...destForm, status: e.target.value })}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="draft">Draft (Private)</option>
                          <option value="published">Published (Public)</option>
                          <option value="verified">Verified (Official)</option>
                        </select>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={destForm.verified}
                          onChange={(e) => setDestForm({ ...destForm, verified: e.target.checked })}
                          className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span className="font-medium text-slate-700">Mark as Historically Verified</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* State Form */}
              {modalType === 'state' && (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-slate-700">State / Territory Name *</label>
                      <input
                        type="text"
                        required
                        value={stateForm.name}
                        onChange={(e) => setStateForm({ ...stateForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Type</label>
                      <select
                        value={stateForm.type}
                        onChange={(e) => setStateForm({ ...stateForm, type: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="State">State</option>
                        <option value="Union Territory">Union Territory</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Capital *</label>
                      <input
                        type="text"
                        required
                        value={stateForm.capital}
                        onChange={(e) => setStateForm({ ...stateForm, capital: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Representative Image URL</label>
                      <input
                        type="url"
                        value={stateForm.image}
                        onChange={(e) => setStateForm({ ...stateForm, image: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Overview Description</label>
                    <textarea
                      rows={3}
                      value={stateForm.description}
                      onChange={(e) => setStateForm({ ...stateForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Culture & Arts</label>
                      <input
                        type="text"
                        value={stateForm.culture}
                        onChange={(e) => setStateForm({ ...stateForm, culture: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Famous Cuisine</label>
                      <input
                        type="text"
                        value={stateForm.cuisine}
                        onChange={(e) => setStateForm({ ...stateForm, cuisine: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* City Form */}
              {modalType === 'city' && (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">City Name *</label>
                      <input
                        type="text"
                        required
                        value={cityForm.name}
                        onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">State *</label>
                      <select
                        required
                        value={cityForm.stateSlug}
                        onChange={(e) => setCityForm({ ...cityForm, stateSlug: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                      >
                        {states.map((s) => (
                          <option key={s.slug} value={s.slug}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">City Description</label>
                    <textarea
                      rows={2}
                      value={cityForm.description}
                      onChange={(e) => setCityForm({ ...cityForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    ></textarea>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Image URL</label>
                    <input
                      type="url"
                      value={cityForm.image}
                      onChange={(e) => setCityForm({ ...cityForm, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              )}

              {/* Category Form */}
              {modalType === 'category' && (
                <div className="space-y-4 text-xs sm:text-sm">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Category Name *</label>
                    <input
                      type="text"
                      required
                      value={catForm.name}
                      onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Description</label>
                    <textarea
                      rows={2}
                      value={catForm.description}
                      onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    ></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Representative Image URL</label>
                    <input
                      type="url"
                      value={catForm.image}
                      onChange={(e) => setCatForm({ ...catForm, image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-medium text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-sm"
                >
                  {modalItem ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
