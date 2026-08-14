import { useState, useEffect, FormEvent } from 'react';
import QRCode from 'qrcode';
import { 
  Store, 
  UtensilsCrossed, 
  QrCode, 
  DollarSign, 
  Users, 
  Plus, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Settings, 
  Printer, 
  Send, 
  Calendar, 
  LogOut, 
  Layers,
  ArrowRight,
  TrendingUp,
  X,
  Clock
} from 'lucide-react';
import { getCurrentSession, logoutTenant, addMenuItem, toggleItemAvailability, getTenantBySlug } from '../services/tenantStore';
import { UserSession, MenuItem, Tenant } from '../types';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}

export function AdminDashboardPage({ navigate }: AdminDashboardPageProps) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'dishes' | 'qrcodes' | 'settings'>('overview');
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    nameKhmer: '',
    category: 'Specialty Khmer',
    priceUSD: 5.0,
    priceKHR: 20500,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    isAvailable: true,
  });

  const [tableQrUrls, setTableQrUrls] = useState<Record<number, string>>({});

  useEffect(() => {
    const cur = getCurrentSession();
    if (!cur) {
      navigate('/login');
      return;
    }
    setSession(cur);
    const updated = getTenantBySlug(cur.tenant.slug) || cur.tenant;
    setTenant(updated);

    // Generate table QRs
    const origin = window.location.origin;
    const urls: Record<number, string> = {};
    for (let i = 1; i <= (updated.tablesCount || 10); i++) {
      const tableUrl = `${origin}/menu/${updated.slug}?table=${i}`;
      QRCode.toDataURL(tableUrl, { width: 180, margin: 1 })
        .then((data) => {
          urls[i] = data;
          if (i === (updated.tablesCount || 10)) {
            setTableQrUrls({ ...urls });
          }
        })
        .catch(console.error);
    }
  }, [navigate]);

  if (!session || !tenant) {
    return null;
  }

  const handleLogout = () => {
    logoutTenant();
    navigate('/login');
  };

  const handleCreateDish = (e: FormEvent) => {
    e.preventDefault();
    if (!newDish.name.trim()) return;

    const updated = addMenuItem(tenant.id, {
      ...newDish,
      priceKHR: Math.round(newDish.priceUSD * 4100),
    });

    if (updated) {
      setTenant(updated);
      setShowAddDishModal(false);
      setNewDish({
        name: '',
        nameKhmer: '',
        category: tenant.categories[0] || 'Specialty',
        priceUSD: 5.0,
        priceKHR: 20500,
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
      });
    }
  };

  const handleToggle = (itemId: string) => {
    const updated = toggleItemAvailability(tenant.id, itemId);
    if (updated) {
      setTenant(updated);
    }
  };

  const origin = window.location.origin;
  const menuLink = `${origin}/menu/${tenant.slug}`;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      {/* Top Tenant Header */}
      <div className="bg-stone-900 text-white border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-extrabold text-xl shadow-md">
                {tenant.businessName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">{tenant.businessName}</h1>
                  <span className={`text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full ${
                    tenant.planType === 'trial' ? 'bg-emerald-500 text-stone-950' : 'bg-amber-500 text-stone-950'
                  }`}>
                    {tenant.planType === 'trial' ? '30-Day Free Trial' : `${tenant.planType.toUpperCase()} Plan`}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-1 font-mono">
                  Slug: <span className="text-amber-400 underline">{tenant.slug}</span> • Role: {session.role.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <button
                id="admin-view-customer-menu-btn"
                onClick={() => navigate(`/menu/${tenant.slug}`)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Live Menu</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => navigate('/pricing')}
                className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-xl font-bold text-xs border border-stone-700"
              >
                Upgrade Plan
              </button>

              <button
                onClick={handleLogout}
                className="p-2 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded-xl"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex gap-2 mt-6 border-t border-stone-800 pt-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              Dashboard Overview
            </button>
            <button
              onClick={() => setActiveTab('dishes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dishes' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              Menu Items ({tenant.menuItems.length})
            </button>
            <button
              onClick={() => setActiveTab('qrcodes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'qrcodes' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-white'
              }`}
            >
              Table QR Codes ({tenant.tablesCount || 10})
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Views */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-stone-500">Today's Revenue</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-stone-900">$248.50</p>
                <p className="text-[11px] text-stone-400 font-mono">≈ ៛1,018,850 KHR (Bakong settled)</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-stone-500">Active Tables</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-stone-900">{tenant.tablesCount || 15} Tables</p>
                <p className="text-[11px] text-emerald-600 font-semibold">100% QR Codes Active</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-stone-500">Menu Items</span>
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-stone-900">{tenant.menuItems.length} Dishes</p>
                <p className="text-[11px] text-stone-400">{tenant.categories.length} Categories</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-stone-500">Subscription Status</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xl font-extrabold text-stone-900">
                  {tenant.planType === 'trial' ? '30 Days Left' : 'Active (Pro)'}
                </p>
                <p className="text-[11px] text-stone-400">
                  Expires: {new Date(tenant.planExpiry).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Customer Menu Link Quick Share Banner */}
            <div className="bg-amber-500/10 border border-amber-300 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  Customer URL
                </span>
                <h3 className="font-extrabold text-lg text-stone-950">Share Your Digital Menu with Diners</h3>
                <p className="text-xs font-mono text-stone-700 select-all">{menuLink}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(menuLink);
                    alert('Menu link copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-white hover:bg-stone-50 text-stone-900 font-bold text-xs rounded-xl border border-stone-300 shadow-xs"
                >
                  Copy Link
                </button>
                <button
                  onClick={() => navigate(`/menu/${tenant.slug}`)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs"
                >
                  Open Live Menu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Menu Items Manager */}
        {activeTab === 'dishes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900">Restaurant Menu Catalog</h2>
                <p className="text-xs text-stone-500">Manage dish titles, Khmer names, prices, and availability</p>
              </div>
              <button
                id="add-new-dish-btn"
                onClick={() => setShowAddDishModal(true)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dish</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tenant.menuItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-100"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-sm text-stone-900 truncate mt-1">{item.name}</h4>
                      {item.nameKhmer && (
                        <p className="text-xs text-stone-500 font-medium">{item.nameKhmer}</p>
                      )}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-extrabold text-sm text-stone-900">${item.priceUSD.toFixed(2)}</span>
                        <span className="font-mono text-[10px] text-stone-400">
                          ≈ ៛{item.priceKHR.toLocaleString()} KHR
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 line-clamp-2">{item.description}</p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className={`text-xs font-bold ${item.isAvailable ? 'text-emerald-600' : 'text-stone-400'}`}>
                      {item.isAvailable ? '● In Stock' : '○ Sold Out'}
                    </span>
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        item.isAvailable
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {item.isAvailable ? 'Mark Sold Out' : 'Mark Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Table QR Codes Generator */}
        {activeTab === 'qrcodes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-stone-900">Dining Table QR Codes</h2>
                <p className="text-xs text-stone-500">
                  Print high-resolution QR standees for each individual dining table.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 self-start"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print All QR Cards</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(tenant.tablesCount || 10)].map((_, i) => {
                const tableNum = i + 1;
                const qrUrl = tableQrUrls[tableNum];
                return (
                  <div
                    key={tableNum}
                    className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col items-center text-center space-y-2 hover:border-amber-400 transition-all"
                  >
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-stone-900 text-amber-400">
                      Table #{tableNum < 10 ? `0${tableNum}` : tableNum}
                    </span>

                    <div className="p-1 bg-stone-50 rounded-xl border border-stone-100">
                      {qrUrl ? (
                        <img src={qrUrl} alt={`Table ${tableNum}`} className="w-28 h-28" />
                      ) : (
                        <div className="w-28 h-28 bg-stone-100 rounded-lg animate-pulse" />
                      )}
                    </div>

                    <p className="text-[10px] text-stone-400 font-mono truncate max-w-full">
                      menucloud.app/menu/{tenant.slug}?table={tableNum}
                    </p>

                    <button
                      onClick={() => {
                        if (qrUrl) {
                          const a = document.createElement('a');
                          a.href = qrUrl;
                          a.download = `${tenant.slug}-table-${tableNum}.png`;
                          a.click();
                        }
                      }}
                      className="w-full py-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                    >
                      Download PNG
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Dish Modal */}
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-lg text-stone-900">Add New Menu Dish</h3>
              <button
                onClick={() => setShowAddDishModal(false)}
                className="p-1 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Dish Name (English)</label>
                <input
                  type="text"
                  required
                  value={newDish.name}
                  onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                  placeholder="e.g. Grilled Khmer Chicken Curry"
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Khmer Title (ភាសាខ្មែរ)</label>
                <input
                  type="text"
                  value={newDish.nameKhmer}
                  onChange={(e) => setNewDish({ ...newDish, nameKhmer: e.target.value })}
                  placeholder="e.g. សម្លការីមាន់ស្រែ"
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={newDish.category}
                    onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-500 bg-white"
                  >
                    {tenant.categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.5"
                    required
                    value={newDish.priceUSD}
                    onChange={(e) => setNewDish({ ...newDish, priceUSD: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={newDish.description}
                  onChange={(e) => setNewDish({ ...newDish, description: e.target.value })}
                  placeholder="Key ingredients, allergens, preparation style..."
                  className="w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDishModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 text-xs font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
