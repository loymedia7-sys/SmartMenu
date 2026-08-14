import { useState, useEffect } from 'react';
import { 
  UtensilsCrossed, 
  Search, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Sparkles, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  Bell, 
  ChevronRight,
  QrCode,
  Store,
  X
} from 'lucide-react';
import { getTenantBySlug } from '../services/tenantStore';
import { Tenant, MenuItem } from '../types';

interface MenuPreviewPageProps {
  slug: string;
  navigate: (path: string) => void;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

export function MenuPreviewPage({ slug, navigate }: MenuPreviewPageProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState<number>(4);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [waiterCalled, setWaiterCalled] = useState(false);

  useEffect(() => {
    const t = getTenantBySlug(slug);
    if (t) {
      setTenant(t);
    }
  }, [slug]);

  if (!tenant) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-3xl max-w-md shadow-xl space-y-4">
          <Store className="w-12 h-12 text-stone-400 mx-auto" />
          <h2 className="text-xl font-bold text-stone-900">Menu Not Found</h2>
          <p className="text-xs text-stone-500">
            No digital menu exists for URL slug: <span className="font-mono text-stone-800 font-bold">"{slug}"</span>
          </p>
          <button
            onClick={() => navigate('/register')}
            className="w-full py-3 bg-amber-500 text-stone-950 font-bold text-xs rounded-xl"
          >
            Register This Shop Name Now
          </button>
        </div>
      </div>
    );
  }

  const allCategories = ['All', ...tenant.categories];

  const filteredItems = tenant.menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nameKhmer && item.nameKhmer.includes(searchQuery)) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) => (c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((c) => (c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c));
      }
      return prev.filter((c) => c.item.id !== itemId);
    });
  };

  const cartTotalUSD = cart.reduce((sum, c) => sum + c.item.priceUSD * c.quantity, 0);
  const cartTotalKHR = cart.reduce((sum, c) => sum + c.item.priceKHR * c.quantity, 0);
  const totalItemsCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      setCart([]);
      setOrderPlaced(false);
      setCartOpen(false);
    }, 2500);
  };

  const handleCallWaiter = () => {
    setWaiterCalled(true);
    setTimeout(() => setWaiterCalled(false), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-100 pb-28 text-stone-900">
      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100 flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Platform Home</span>
          </button>

          {/* Table Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">Table:</span>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(Number(e.target.value))}
              className="bg-amber-100 text-amber-950 font-bold text-xs px-2.5 py-1 rounded-lg border border-amber-200 focus:outline-none"
            >
              {[...Array(tenant.tablesCount || 15)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Table #{i + 1 < 10 ? `0${i + 1}` : i + 1}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCallWaiter}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              waiterCalled
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-600" />
            <span>{waiterCalled ? 'Staff Notified!' : 'Call Staff'}</span>
          </button>
        </div>
      </header>

      {/* Restaurant Header Hero */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white shadow-lg">
          <img
            src={tenant.coverUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80'}
            alt={tenant.businessName}
            className="w-full h-44 object-cover opacity-40"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent p-5 flex flex-col justify-end">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-stone-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                Open for Dining
              </span>
              <span className="text-[11px] text-stone-300 font-medium">Bakong KHQR Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">{tenant.businessName}</h1>
            <p className="text-xs text-stone-300 mt-0.5">{tenant.address || 'Bassac Lane, Phnom Penh, Cambodia'}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food, drinks, អាហារ... (e.g. Amok, Coffee)"
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dish Items Grid */}
        <div className="mt-4 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="py-12 bg-white rounded-3xl border border-stone-200 text-center text-stone-500">
              <UtensilsCrossed className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">No menu items found</p>
              <p className="text-xs text-stone-400">Try searching for something else</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const inCart = cart.find((c) => c.item.id === item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center justify-between gap-4 hover:border-amber-300 transition-all"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-stone-100"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-sm text-stone-900 truncate">{item.name}</h4>
                        {item.isPopular && (
                          <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                            Popular
                          </span>
                        )}
                      </div>
                      {item.nameKhmer && (
                        <p className="text-xs text-stone-500 font-medium">{item.nameKhmer}</p>
                      )}
                      <p className="text-[11px] text-stone-400 line-clamp-1">{item.description}</p>
                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="font-extrabold text-sm text-amber-700">${item.priceUSD.toFixed(2)}</span>
                        <span className="font-mono text-[10px] text-stone-400">
                          ≈ ៛{item.priceKHR.toLocaleString()} KHR
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add / Qty Control */}
                  <div className="shrink-0">
                    {inCart ? (
                      <div className="flex items-center gap-2 bg-amber-50 rounded-xl border border-amber-200 p-1">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-7 h-7 rounded-lg bg-white text-stone-800 hover:bg-stone-100 flex items-center justify-center font-bold text-xs shadow-xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-xs font-mono text-stone-900 w-4 text-center">
                          {inCart.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 hover:bg-amber-600 flex items-center justify-center font-bold text-xs shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 animate-in slide-in-from-bottom">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full py-3.5 px-5 bg-stone-950 text-white rounded-2xl shadow-xl flex items-center justify-between font-bold text-sm border border-stone-800 hover:bg-stone-900 transition-transform active:scale-95"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 text-xs flex items-center justify-center font-mono">
                {totalItemsCount}
              </span>
              <span>View Table #{selectedTable} Order</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-amber-400 font-extrabold">${cartTotalUSD.toFixed(2)}</span>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </div>
          </button>
        </div>
      )}

      {/* Cart & Checkout Modal */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-200">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="font-bold text-base text-stone-900">Table #{selectedTable} Dining Bill</h3>
                <p className="text-xs text-stone-500">{tenant.businessName}</p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-lg text-stone-400 hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map(({ item, quantity }) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-2 border-b border-stone-100">
                  <div className="flex-1 min-w-0 pr-3">
                    <p className="font-bold text-stone-900 truncate">{item.name}</p>
                    <p className="text-[11px] text-stone-400">
                      ${item.priceUSD.toFixed(2)} x {quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-6 h-6 rounded bg-stone-100 text-stone-700 flex items-center justify-center font-bold"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold">{quantity}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-6 h-6 rounded bg-amber-500 text-stone-950 flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                    <span className="font-mono font-bold text-stone-900 w-16 text-right">
                      ${(item.priceUSD * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}

              <div className="pt-3 space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between font-bold text-stone-900 text-sm">
                  <span>Grand Total Due</span>
                  <span className="font-mono font-extrabold text-amber-700">${cartTotalUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-400 font-mono">
                  <span>In Khmer Riel</span>
                  <span>≈ ៛{cartTotalKHR.toLocaleString()} KHR</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-2">
              {orderPlaced ? (
                <div className="p-3.5 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  <span>Order sent to Kitchen & Telegram Bot!</span>
                </div>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Place Order & Pay via Bakong KHQR</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
