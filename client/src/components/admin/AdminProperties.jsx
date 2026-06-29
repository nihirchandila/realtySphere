import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Badge = ({ status }) => {
  const cfg = {
    approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border border-amber-200",
    rejected: "bg-red-50 text-red-700 border border-red-200",
  };
  return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${cfg[status] || cfg.pending}`}>{status}</span>;
};

const PropertyModal = ({ property, onClose, onApprove, onDisapprove }) => {
  const imageUrl = property.images?.[0]
    ? `${property.images[0]}`
    : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative h-52 overflow-hidden">
          <img src={imageUrl} alt={property.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors">
            <Icon d="M18 6L6 18M6 6l12 12" size={16} />
          </button>
          <div className="absolute bottom-3 left-4">
            <Badge status={property.status} />
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{property.title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{property.address}, {property.city}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["Price", `₹${Number(property.price).toLocaleString("en-IN")}`],
              ["Type", property.propertyType],
              ["Listing", property.listingType === "sale" ? "For Sale" : "For Rent"],
              ["Area", property.area ? `${property.area} sq ft` : "N/A"],
              ["Bedrooms", property.bedrooms ?? "N/A"],
              ["Bathrooms", property.bathrooms ?? "N/A"],
            ].map(([k, v]) => (
              <div key={k} className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-400 mb-0.5">{k}</p>
                <p className="font-semibold text-gray-900 capitalize">{v}</p>
              </div>
            ))}
          </div>
          {property.description && (
            <p className="text-sm text-gray-500 leading-relaxed">{property.description}</p>
          )}
          <div className="flex gap-3 pt-2">
            {property.status !== "approved" ? (
              <button onClick={() => onApprove(property._id)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3 rounded-full transition-colors">
                Approve Listing
              </button>
            ) : (
              <button onClick={() => onDisapprove(property._id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-3 rounded-full transition-colors">
                Disapprove Listing
              </button>
            )}
            <button onClick={onClose} className="flex-1 border border-gray-200 hover:border-gray-400 text-gray-700 text-sm font-semibold py-3 rounded-full transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminProperties({ filter }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/property`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setProperties(data.properties);
    } catch {
      toast.error("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${API_URL}/property/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "approved" }),
      });
      const data = await res.json();
      if (data.success) {
        setProperties(prev => prev.map(p => p._id === id ? { ...p, status: "approved" } : p));
        setSelectedProperty(prev => prev ? { ...prev, status: "approved" } : null);
        toast.success("Property approved.");
      }
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleDisapprove = async (id) => {
    try {
      const res = await fetch(`${API_URL}/property/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      });
      const data = await res.json();
      if (data.success) {
        setProperties(prev => prev.map(p => p._id === id ? { ...p, status: "rejected" } : p));
        setSelectedProperty(prev => prev ? { ...prev, status: "rejected" } : null);
        toast.success("Property rejected.");
      }
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const filtered = filter === "all"
    ? properties
    : properties.filter(p => p.status === filter);

  const title = filter === "approved" ? "Approved Properties" : "Pending Approval";
  const subtitle = filter === "approved"
    ? `${filtered.length} active listings`
    : `${filtered.length} listings awaiting review`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg className="animate-spin w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">Property</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-4">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-4">Listing</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-4">Price</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-4">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-4">City</th>
                  <th className="px-4 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-400 py-16 text-sm">No properties here.</td>
                  </tr>
                ) : (
                  filtered.map(p => {
                    const thumb = p.images?.[0]
                      ? `${p.images[0]}`
                      : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100";
                    return (
                      <tr key={p._id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img src={thumb} alt={p.title} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-900 leading-tight">{p.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{p.address}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-600 capitalize">{p.propertyType}</td>
                        <td className="px-4 py-4 text-gray-600 capitalize">{p.listingType === "sale" ? "For Sale" : "For Rent"}</td>
                        <td className="px-4 py-4 font-semibold text-gray-900">₹{Number(p.price).toLocaleString("en-IN")}</td>
                        <td className="px-4 py-4"><Badge status={p.status || "pending"} /></td>
                        <td className="px-4 py-4 text-gray-600">{p.city || "—"}</td>
                        <td className="px-4 py-4">
                          <button onClick={() => setSelectedProperty(p)} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-full transition-colors">
                            <Icon d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z" size={13} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onApprove={handleApprove}
          onDisapprove={handleDisapprove}
        />
      )}
    </>
  );
}