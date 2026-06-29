const inputClass =
  "w-full bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white border border-transparent focus:border-gray-300 transition-all";
const selectClass =
  "w-full bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-gray-300 border border-transparent focus:border-gray-300 transition-all";

export default function PropertyForm({ form, setForm, imagePreviews, onFileChange, onRemoveImage, fileInputRef }) {
  return (
    <div className="flex flex-col gap-5">

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Property Title</label>
        <input type="text" placeholder="e.g. The Pinnacle at Highland Park" required
          value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
          className={inputClass} />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Description</label>
        <textarea placeholder="Describe the property..." required rows={3}
          value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
          className={`${inputClass} resize-none`} />
      </div>

      {/* Property Type + Listing Type */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Property Type</label>
          <select value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })} className={selectClass}>
            {["house", "flat", "villa", "plot", "commercial"].map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Listing Type</label>
          <select value={form.listingType} onChange={e => setForm({ ...form, listingType: e.target.value })} className={selectClass}>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </div>
      </div>

      {/* Price + Area */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Price (₹)</label>
          <input type="number" placeholder="e.g. 5000000" required
            value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
            className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Area (sq ft)</label>
          <input type="number" placeholder="e.g. 1200"
            value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}
            className={inputClass} />
        </div>
      </div>

      {/* Beds + Baths */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Bedrooms</label>
          <input type="number" placeholder="e.g. 3" min="0"
            value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })}
            className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Bathrooms</label>
          <input type="number" placeholder="e.g. 2" min="0"
            value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })}
            className={inputClass} />
        </div>
      </div>

      {/* Address */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Address</label>
        <input type="text" placeholder="123 Maple Street"
          value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
          className={inputClass} />
      </div>

      {/* City + State + Pincode */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">City</label>
          <input type="text" placeholder="Mumbai"
            value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
            className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">State</label>
          <input type="text" placeholder="Maharashtra"
            value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}
            className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Pincode</label>
          <input type="text" placeholder="400001"
            value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })}
            className={inputClass} />
        </div>
      </div>

      {/* Amenities */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Amenities</label>
        <input type="text" placeholder="Parking, Gym, Pool, Security (comma separated)"
          value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })}
          className={inputClass} />
        <p className="text-xs text-gray-400">Separate each amenity with a comma</p>
      </div>

      {/* 3D URL */}
      <div className="flex flex-col gap-1.5 border-t border-gray-100 pt-4">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">3D Model URL</label>
        <input type="text" placeholder="https://example.com/model.glb"
          value={form.model3dUrl} onChange={e => setForm({ ...form, model3dUrl: e.target.value })}
          className={inputClass} />
      </div>

      {/* Image Upload */}
      <div className="flex flex-col gap-2 border-t border-gray-100 pt-4">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">Property Images</label>
        <div
          className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); onFileChange(e.dataTransfer.files); }}
        >
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={e => onFileChange(e.target.files)} />
          <svg className="w-8 h-8 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm text-gray-500">Click to upload or drag & drop</p>
          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
        </div>

        {imagePreviews.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {imagePreviews.map((src, i) => (
              <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 group">
                <img
                  src={typeof src === "string" && src.startsWith("/uploads") ? `http://localhost:3000${src}` : src}
                  alt="" className="w-full h-full object-cover"
                />
                <button type="button" onClick={() => onRemoveImage(i)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/50 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}