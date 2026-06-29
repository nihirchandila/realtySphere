import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const BedIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9V19M22 9V19M2 14h20M2 9a5 5 0 015-5h10a5 5 0 015 5" />
    <path d="M6 14V9M18 14V9" />
  </svg>
);

const BathIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z" />
    <path d="M6 12V6a2 2 0 012-2h1" />
    <path d="M4 20l-1 2M20 20l1 2" />
  </svg>
);

const formatPrice = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2.5 cursor-pointer group">
    <div
      onClick={onChange}
      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
        checked ? "bg-gray-900 border-gray-900" : "border-gray-300 group-hover:border-gray-500"
      }`}
    >
      {checked && (
        <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5">
          <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

const PillButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
      active
        ? "bg-gray-900 text-white border-gray-900"
        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
    }`}
  >
    {label}
  </button>
);

const PropertyCard = ({ property }) => {
  const imageUrl = property.images?.[0]
    ? `${property.images[0]}`
    : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600";

  const hasBeds = property.bedrooms != null && property.bedrooms > 0;
  const hasBaths = property.bathrooms != null && property.bathrooms > 0;
  const showStats = hasBeds || hasBaths;

  return (
    <div className="flex flex-col gap-3 group cursor-pointer">
      <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
        <img
          src={imageUrl}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
          {property.listingType === "sale" ? "For Sale" : "For Rent"}
        </span>
      </div>

      {showStats && (
        <div className="flex items-center gap-3 text-gray-500 text-xs">
          {hasBeds && (
            <span className="flex items-center gap-1.5">
              <BedIcon />
              {property.bedrooms} Bedroom{property.bedrooms !== 1 ? "s" : ""}
            </span>
          )}
          {hasBeds && hasBaths && <span className="text-gray-300">·</span>}
          {hasBaths && (
            <span className="flex items-center gap-1.5">
              <BathIcon />
              {property.bathrooms} Bathroom{property.bathrooms !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      )}

      <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-green-600 transition-colors">
        {property.title}
      </h3>
      <p className="text-sm text-gray-700">
        <span className="font-bold text-gray-900">{formatPrice(property.price)}</span>
        <span className="text-gray-400 mx-2">·</span>
        <span className="text-gray-500">{property.address}{property.city ? `, ${property.city}` : ""}</span>
      </p>
    </div>
  );
};

export default function PropertiesPage() {
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [saleType, setSaleType] = useState("any");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [types, setTypes] = useState({ house: false, flat: false, villa: false, plot: false, commercial: false });
  const [beds, setBeds] = useState({ 1: false, 2: false, 3: false, "4+": false });
  const [baths, setBaths] = useState("any");
  const [city, setCity] = useState("any");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`${API_URL}/property`);
        const data = await res.json();
        if (data.success) {
          const approved = data.properties.filter(p => p.status === "approved");
          setAllProperties(approved);

          // Set price range dynamically from data
          if (approved.length > 0) {
            const prices = approved.map(p => Number(p.price));
            const min = Math.min(...prices);
            const max = Math.max(...prices);
            setMinPrice(min);
            setMaxPrice(max);
            setPriceRange([min, max]);
          }
        }
      } catch {
        console.error("Failed to fetch properties.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const cities = useMemo(() => {
    const unique = [...new Set(allProperties.map(p => p.city).filter(Boolean))];
    return ["any", ...unique];
  }, [allProperties]);

  const toggleType = (t) => setTypes(prev => ({ ...prev, [t]: !prev[t] }));
  const toggleBed = (b) => setBeds(prev => ({ ...prev, [b]: !prev[b] }));

  const activeTypes = Object.entries(types).filter(([, v]) => v).map(([k]) => k);
  const activeBeds = Object.entries(beds).filter(([, v]) => v).map(([k]) => k);

  const filtered = useMemo(() => {
    return allProperties.filter(p => {
      if (saleType !== "any" && p.listingType !== saleType) return false;
      if (Number(p.price) < priceRange[0] || Number(p.price) > priceRange[1]) return false;
      if (activeTypes.length > 0 && !activeTypes.includes(p.propertyType)) return false;
      if (activeBeds.length > 0) {
        const match = activeBeds.some(b => {
          if (b === "4+") return p.bedrooms >= 4;
          return p.bedrooms === parseInt(b);
        });
        if (!match) return false;
      }
      if (baths !== "any" && p.bathrooms !== parseInt(baths)) return false;
      if (city !== "any" && p.city !== city) return false;
      return true;
    });
  }, [allProperties, saleType, priceRange, activeTypes, activeBeds, baths, city]);

  const handleMinPrice = (e) => {
    const val = Math.min(Number(e.target.value), priceRange[1] - 50000);
    setPriceRange([val, priceRange[1]]);
  };

  const handleMaxPrice = (e) => {
    const val = Math.max(Number(e.target.value), priceRange[0] + 50000);
    setPriceRange([priceRange[0], val]);
  };

  const minPct = maxPrice > minPrice ? ((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100 : 0;
  const maxPct = maxPrice > minPrice ? ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100 : 100;

  const handleReset = () => {
    setSaleType("any");
    setPriceRange([minPrice, maxPrice]);
    setTypes({ house: false, flat: false, villa: false, plot: false, commercial: false });
    setBeds({ 1: false, 2: false, 3: false, "4+": false });
    setBaths("any");
    setCity("any");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container">
        <div className="mx-auto py-10 flex gap-10">

          {/* ── Sidebar ── */}
          <aside className="w-64 shrink-0 space-y-8">

            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{filtered.length}</span> results
            </p>

            {/* Sale Type */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Sale type</h3>
              <div className="flex flex-wrap gap-2">
                {["any", "sale", "rent"].map(s => (
                  <PillButton key={s} label={s === "any" ? "Any" : s === "sale" ? "For Sale" : "For Rent"} active={saleType === s} onClick={() => setSaleType(s)} />
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Price</h3>
              <div className="relative h-5 mb-4">
                <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-gray-200">
                  <div
                    className="absolute h-full bg-gray-900 rounded-full"
                    style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
                  />
                </div>
                <input type="range" min={minPrice} max={maxPrice} step={10000} value={priceRange[0]}
                  onChange={handleMinPrice}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                  style={{ zIndex: priceRange[0] > maxPrice - 100000 ? 5 : 3 }}
                />
                <input type="range" min={minPrice} max={maxPrice} step={10000} value={priceRange[1]}
                  onChange={handleMaxPrice}
                  className="absolute w-full h-full opacity-0 cursor-pointer"
                  style={{ zIndex: 4 }}
                />
                <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-900 border-2 border-white shadow pointer-events-none"
                  style={{ left: `calc(${minPct}% - 8px)` }} />
                <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-900 border-2 border-white shadow pointer-events-none"
                  style={{ left: `calc(${maxPct}% - 8px)` }} />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 text-center bg-gray-50">
                  ₹{(priceRange[0] / 100000).toFixed(1)}L
                </div>
                <span className="text-gray-300">—</span>
                <div className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 text-center bg-gray-50">
                  ₹{(priceRange[1] / 100000).toFixed(1)}L
                </div>
              </div>
            </div>

            {/* Property Type */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Property type</h3>
              <div className="space-y-2.5">
                {Object.keys(types).map(t => (
                  <Checkbox
                    key={t}
                    label={t.charAt(0).toUpperCase() + t.slice(1) + "s"}
                    checked={types[t]}
                    onChange={() => toggleType(t)}
                  />
                ))}
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Bedrooms</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(beds).map(b => (
                  <button
                    key={b}
                    onClick={() => toggleBed(b)}
                    className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                      beds[b] ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Bathrooms</h3>
              <div className="flex flex-wrap gap-2">
                {["any", "1", "2", "3"].map(b => (
                  <PillButton key={b} label={b === "any" ? "Any" : b} active={baths === b} onClick={() => setBaths(b)} />
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-3">City</h3>
              <div className="flex flex-wrap gap-2">
                {cities.map(c => (
                  <PillButton key={c} label={c === "any" ? "Any" : c} active={city === c} onClick={() => setCity(c)} />
                ))}
              </div>
            </div>

            <button
              onClick={handleReset}
              className="text-sm text-gray-400 hover:text-gray-700 underline underline-offset-2 transition-colors"
            >
              Reset all filters
            </button>
          </aside>

          {/* ── Main Content ── */}
          <main className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10">
              <div className="max-w-md">
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3">
                  Explore our premier properties
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Each listing offers unique features, exceptional quality, and prime locations,
                  ensuring an exclusive living experience.
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <svg className="animate-spin w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                </svg>
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                {filtered.map(property => (
                    <Link key={property._id} to={`/property/${property._id}`}>
                      <PropertyCard key={property._id} property={property} />
                    </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <p className="text-gray-900 font-semibold mb-1">No properties found</p>
                <p className="text-gray-500 text-sm">Try adjusting or resetting your filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}