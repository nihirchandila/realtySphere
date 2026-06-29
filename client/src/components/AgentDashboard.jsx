import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PropertyForm from "../components/AddPropertyModal";

const API_URL = import.meta.env.VITE_API_URL;

const emptyForm = {
  title: "",
  description: "",
  propertyType: "house",
  listingType: "sale",
  price: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  bedrooms: "",
  bathrooms: "",
  area: "",
  amenities: "",
  model3dUrl: "",
};

export default function AgentDashboard() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [agentUser, setAgentUser] = useState({});
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("agentToken");

  useEffect(() => {
    const stored = localStorage.getItem("agentUser");
    if (stored) setAgentUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    fetchProperties();
  }, []);

 const fetchProperties = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/property/my`, {  // ← /my instead of /
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

  const handleFiles = (files) => {
    Array.from(files).forEach(file => {
      setImageFiles(prev => [...prev, file]);
      const reader = new FileReader();
      reader.onload = e => setImagePreviews(prev => [...prev, e.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => {
    const preview = imagePreviews[idx];
    if (typeof preview === "string" && preview.startsWith("/uploads")) {
      setExistingImages(prev => prev.filter(img => img !== preview));
    } else {
      // it's a new file — remove from imageFiles by matching index of new files
      const newFileIndex = imagePreviews
        .slice(0, idx)
        .filter(p => !p.startsWith("/uploads")).length;
      setImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
    }
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const openAdd = () => {
    setForm(emptyForm);
    setImagePreviews([]);
    setImageFiles([]);
    setExistingImages([]);
    setShowAddModal(true);
  };

  const closeAdd = () => {
    setShowAddModal(false);
    setForm(emptyForm);
    setImagePreviews([]);
    setImageFiles([]);
    setExistingImages([]);
  };

  const openEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title || "",
      description: p.description || "",
      propertyType: p.propertyType || "house",
      listingType: p.listingType || "sale",
      price: String(p.price || ""),
      address: p.address || "",
      city: p.city || "",
      state: p.state || "",
      pincode: p.pincode || "",
      bedrooms: String(p.bedrooms || ""),
      bathrooms: String(p.bathrooms || ""),
      area: String(p.area || ""),
      amenities: (p.amenities || []).join(", "),
      model3dUrl: p.model3dUrls?.[0] || "",
    });
    setExistingImages(p.images || []);
    setImagePreviews(p.images || []);
    setImageFiles([]);
    setShowEditModal(true);
  };

  const closeEdit = () => {
    setShowEditModal(false);
    setEditingId(null);
    setForm(emptyForm);
    setImagePreviews([]);
    setImageFiles([]);
    setExistingImages([]);
  };

  const buildFormData = () => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("propertyType", form.propertyType);
    formData.append("listingType", form.listingType);
    formData.append("price", form.price);
    formData.append("address", form.address);
    formData.append("city", form.city);
    formData.append("state", form.state);
    formData.append("pincode", form.pincode);
    formData.append("bedrooms", form.bedrooms);
    formData.append("bathrooms", form.bathrooms);
    formData.append("area", form.area);

    const amenitiesArr = form.amenities
      .split(",")
      .map(a => a.trim())
      .filter(Boolean);
    amenitiesArr.forEach(a => formData.append("amenities", a));

    if (form.model3dUrl) {
      formData.append("model3dUrls", JSON.stringify([form.model3dUrl]));
    }

    formData.append("existingImages", JSON.stringify(existingImages));
    imageFiles.forEach(file => formData.append("images", file));

    return formData;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/property`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: buildFormData(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to add property.");
        return;
      }
      toast.success("Property added!");
      closeAdd();
      fetchProperties();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/property/${editingId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: buildFormData(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to update property.");
        return;
      }
      toast.success("Property updated!");
      closeEdit();
      fetchProperties();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      const res = await fetch(`${API_URL}/property/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProperties(prev => prev.filter(p => p._id !== id));
        toast.success("Property deleted.");
      }
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("agentToken");
    localStorage.removeItem("agentUser");
    window.location.href = "/agent/login";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      {/* ── Topbar ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Properties</h1>
          <p className="text-xs text-gray-400">Welcome back, {agentUser.name || "Agent"}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 transition-colors text-white text-sm font-semibold px-4 py-2.5 rounded-xl"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Property
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 px-6 py-6 overflow-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">All Properties</h2>
            <span className="text-xs text-gray-400">{properties.length} total</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <svg className="animate-spin w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
              </svg>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-100 bg-gray-50">
                    {["Title", "Type", "Listing", "Price", "City", "Status", ""].map(h => (
                      <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {properties.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-gray-400 py-16 text-sm">
                        No properties yet. Click "Add Property" to get started.
                      </td>
                    </tr>
                  ) : (
                    properties.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">{p.title}</td>
                        <td className="px-5 py-4 text-gray-600 capitalize">{p.propertyType}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.listingType === "sale" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                            For {p.listingType === "sale" ? "Sale" : "Rent"}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-900">₹{Number(p.price).toLocaleString("en-IN")}</td>
                        <td className="px-5 py-4 text-gray-600">{p.city || "—"}</td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                            {p.status || "pending"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(p)} className="text-gray-300 hover:text-blue-400 transition-colors" title="Edit">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button onClick={() => handleDelete(p._id)} className="text-gray-300 hover:text-red-400 transition-colors" title="Delete">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Modal ── */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={e => { if (e.target === e.currentTarget) closeAdd(); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-10 relative">
            <button onClick={closeAdd}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500">
              ✕
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Property</h2>
            <form onSubmit={handleAdd} className="flex flex-col gap-2">
              <PropertyForm
                form={form}
                setForm={setForm}
                imagePreviews={imagePreviews}
                onFileChange={handleFiles}
                onRemoveImage={removeImage}
                fileInputRef={fileInputRef}
              />
              <button type="submit" disabled={submitting}
                className="w-full mt-4 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 transition-colors text-white text-sm font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                    </svg>
                    Adding...
                  </>
                ) : "Add Property →"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={e => { if (e.target === e.currentTarget) closeEdit(); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-10 relative">
            <button onClick={closeEdit}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500">
              ✕
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Property</h2>
            <form onSubmit={handleEdit} className="flex flex-col gap-2">
              <PropertyForm
                form={form}
                setForm={setForm}
                imagePreviews={imagePreviews}
                onFileChange={handleFiles}
                onRemoveImage={removeImage}
                fileInputRef={fileInputRef}
              />
              <button type="submit" disabled={submitting}
                className="w-full mt-4 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 transition-colors text-white text-sm font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                    </svg>
                    Saving...
                  </>
                ) : "Save Changes →"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}