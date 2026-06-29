import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PropertyViewer3D from "../components/PropertyViewer3D";

const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = "http://localhost:3000";

// ── Icons ─────────────────────────────────────────────────────────────────────
const icons = {
  bed: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M2 9V19M22 9V19M2 14h20M2 9a5 5 0 015-5h10a5 5 0 015 5" /><path d="M6 14V9M18 14V9" />
    </svg>
  ),
  bath: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z" /><path d="M6 12V6a2 2 0 012-2h1" /><path d="M4 20l-1 2M20 20l1 2" />
    </svg>
  ),
  area: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
    </svg>
  ),
  cube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  expand: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  location: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  back: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
};

// ── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox = ({ images, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors">
        {icons.close}
      </button>
      <button onClick={e => { e.stopPropagation(); prev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="15 18 9 12 15 6" /></svg>
      </button>
      <img
        src={images[idx]}
        alt={`Image ${idx + 1}`}
        className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl"
        onClick={e => e.stopPropagation()}
      />
      <button onClick={e => { e.stopPropagation(); next(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
        {icons.arrow}
      </button>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {idx + 1} / {images.length}
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`${API_URL}/property/${id}`)
        const data = await res.json();
        if (data._id) {
          setProperty(data);
          if (data.images?.length > 0) {
            setActiveImage(`/uploads/${data.images[0]}`);
          }
        }
      } catch {
        console.error("Failed to fetch property.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <svg className="animate-spin w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <p className="text-gray-900 font-semibold">Property not found.</p>
        <button onClick={() => navigate("/properties")} className="text-sm text-gray-500 underline">
          Back to listings
        </button>
      </div>
    );
  }

  const imageUrls = property.images?.map(img => `/uploads/${img}`) || [];
  const fallback = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800";
  const displayImages = imageUrls.length > 0 ? imageUrls : [fallback];
  const currentActiveImage = activeImage || displayImages[0];

  // Build stats from real data
  const stats = [
    property.bedrooms && { label: "Bedrooms", value: property.bedrooms },
    property.bathrooms && { label: "Bathrooms", value: property.bathrooms },
    property.area && { label: "Area", value: `${property.area} sqft` },
    property.city && { label: "City", value: property.city },
    property.state && { label: "State", value: property.state },
    property.pincode && { label: "Pincode", value: property.pincode },
  ].filter(Boolean);

  // Build features from amenities
  const amenityIconMap = {
    parking: "garage", gym: "gym", pool: "pool", garden: "garden",
    security: "security", default: "area",
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container">
        <div className="mx-auto py-10">

          {/* ── Breadcrumb ── */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link to="/allProperties" className="hover:text-gray-700 transition-colors">Properties</Link>
            <span>/</span>
            {property.city && (
              <>
                <span className="hover:text-gray-700 cursor-pointer transition-colors">{property.city}</span>
                <span>/</span>
              </>
            )}
            <span className="text-gray-800 font-medium truncate">{property.title}</span>
          </nav>

          {/* ── Gallery ── */}
          <div className="mb-10">
            {/* Hero image */}
            <div
              className="relative rounded-2xl overflow-hidden aspect-[16/7] mb-3 group cursor-pointer"
              onClick={() => setLightbox({ images: displayImages, index: displayImages.indexOf(currentActiveImage) })}
            >
              <img
                src={currentActiveImage}
                alt={property.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                {property.listingType === "sale" ? "For Sale" : "For Rent"}
              </span>
              <button className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-1.5 hover:bg-black/70 transition-colors">
                {icons.expand}
                View full screen
              </button>
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 p-2">
                {displayImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(src)}
                    className={`shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      currentActiveImage === src ? "border-gray-900 scale-105" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img src={src} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Content Layout ── */}
          <div className="flex gap-10 mb-16">

            {/* Left: Main Info */}
            <div className="flex-1 min-w-0 space-y-10">

              {/* Title block */}
              <div>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  {icons.location}
                  <span>{property.address}{property.city ? `, ${property.city}` : ""}{property.state ? `, ${property.state}` : ""}</span>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">{property.title}</h1>
                {property.description && (
                  <p className="text-gray-500 text-base leading-relaxed">{property.description}</p>
                )}
              </div>

              {/* Stats strip */}
              {stats.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {stats.map(s => (
                    <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-xl font-bold text-gray-900">{s.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Amenities */}
              {property.amenities?.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-5">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {property.amenities.map((amenity, i) => {
                      const key = Object.keys(amenityIconMap).find(k =>
                        amenity.toLowerCase().includes(k)
                      ) || "default";
                      return (
                        <div key={i} className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-3 hover:border-gray-300 transition-colors">
                          <span className="text-gray-500">{icons[amenityIconMap[key]]}</span>
                          <span className="text-sm text-gray-700 font-medium">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* About */}
              {property.description && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About this property</h2>
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Find the Property That Fits Your Lifestyle</h2>
                    <p> Whether you're searching for your first home, upgrading to a larger space, or making a smart investment, our carefully verified listings offer something for every need. Explore properties in prime locations with detailed information, transparent pricing, and trusted agents to help you make confident decisions.</p>
                     <h2 className="text-xl font-semibold text-gray-900">Discover Homes Designed for Every Chapter of Life</h2>
                    <p>From modern apartments and luxury villas to commercial spaces and residential plots, our platform connects you with properties that match your goals.</p>
                     <h2 className="text-xl font-semibold text-gray-900">Explore Premium Properties Across Prime Locations</h2>
                    <p>Browse a diverse collection of verified properties selected for their quality, location, and value. Whether buying, selling, or investing, our platform simplifies your journey with reliable information, trusted professionals, and a seamless property search experience.</p>
                    {/* {property.description.split("\n\n").map((para, i) => (
                      <p key={i} className="text-gray-600 text-sm leading-relaxed">{para.trim()}</p>
                    ))} */}
                  </div>
                </div>
              )}
            </div>


            {/* Right: Sticky Price Card */}
            <aside className="w-80 shrink-0">
              <div className="sticky top-6 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    {property.listingType === "sale" ? "Asking Price" : "Monthly Rent"}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{Number(property.price).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Type</span>
                    <span className="font-medium text-gray-900 capitalize">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Listing</span>
                    <span className="font-medium text-gray-900">
                      {property.listingType === "sale" ? "For Sale" : "For Rent"}
                    </span>
                  </div>
                  {property.area && (
                    <div className="flex justify-between">
                      <span>Area</span>
                      <span className="font-medium text-gray-900">{property.area} sqft</span>
                    </div>
                  )}
                  {property.city && (
                    <div className="flex justify-between">
                      <span>City</span>
                      <span className="font-medium text-gray-900">{property.city}</span>
                    </div>
                  )}
                  {property.state && (
                    <div className="flex justify-between">
                      <span>State</span>
                      <span className="font-medium text-gray-900">{property.state}</span>
                    </div>
                  )}
                </div>

                <Link
                  to="/contact"
                  className="w-full bg-gray-900 hover:bg-gray-700 transition-colors text-white font-semibold text-sm py-3.5 rounded-full flex items-center justify-center"
                >
                  Request a Viewing
                </Link>
                <Link
                  to="/contact"
                  className="w-full border border-gray-200 hover:border-gray-400 transition-colors text-gray-700 font-semibold text-sm py-3.5 rounded-full flex items-center justify-center"
                >
                  Contact Agent
                </Link>
                <div className="border-t border-gray-100 pt-4">
                  <div>
                       <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                      <img src="https://i.pravatar.cc/80?img=12" alt="Agent" className="w-full h-full object-cover" />
                  </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {property.createdBy?.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {property.createdBy?.agencyName}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* ── 3D View Section ── */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-gray-400">{icons.cube}</span>
              <h2 className="text-xl font-bold text-gray-900">3D Property Tour</h2>
              <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
                Interactive
              </span>
            </div>
            <PropertyViewer3D />
          </div>
          
          {/* ── Interior Images ── */}
          {displayImages.length > 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Property Photos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {displayImages.map((src, i) => (
                  <div
                    key={i}
                    className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-[4/3]"
                    onClick={() => setLightbox({ images: displayImages, index: i })}
                  >
                    <img
                      src={src}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                        {icons.expand}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
                        Photo {i + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}