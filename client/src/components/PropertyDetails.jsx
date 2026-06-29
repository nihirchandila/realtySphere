// import { useState } from "react";

// // ── Sample property data ──────────────────────────────────────────────────────
// const property = {
//   id: 1,
//   badge: "For Sale",
//   title: "The Pinnacle at Highland Park",
//   subtitle: "123 Maple Street, New York, NY 10001",
//   shortDesc: "A rare offering in one of Manhattan's most coveted enclaves — this architectural gem combines timeless design with contemporary living.",
//   longDesc: `Perched atop Highland Park, this extraordinary five-bedroom residence redefines luxury living in New York. Designed by award-winning architect James Harlow, every detail of this home has been considered with precision — from the hand-laid Italian marble floors to the floor-to-ceiling windows that flood the interiors with natural light.

// The open-plan kitchen and living area flows seamlessly onto a wraparound terrace, offering panoramic views of the park and city skyline. The chef's kitchen features custom walnut cabinetry, Miele appliances, and an oversized island perfect for entertaining. Upstairs, the primary suite is a private retreat with a spa-inspired ensuite, walk-in dressing room, and a private balcony overlooking the treetops.

// The lower level houses a home cinema, wine cellar, and a fully equipped gym. A dedicated concierge, 24-hour security, and two private parking spaces complete this unrivalled offering. Rarely does a property of this calibre come to market.`,
//   price: "$3,567,980.00",
//   priceLabel: "Asking Price",
//   stats: [
//     { label: "Bedrooms", value: "5" },
//     { label: "Bathrooms", value: "2" },
//     { label: "Area", value: "4,200 sqft" },
//     { label: "Year Built", value: "2019" },
//     { label: "Garage", value: "2 Cars" },
//     { label: "Floors", value: "3" },
//   ],
//   features: [
//     { icon: "bed", label: "5 Bedrooms" },
//     { icon: "bath", label: "2 Bathrooms" },
//     { icon: "area", label: "4,200 sq ft" },
//     { icon: "garage", label: "Double Garage" },
//     { icon: "pool", label: "Heated Pool" },
//     { icon: "garden", label: "Private Garden" },
//     { icon: "gym", label: "Home Gym" },
//     { icon: "security", label: "24/7 Security" },
//   ],
//   mainImage: "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?q=80&w=1600&auto=format&fit=crop",
//   thumbnails: [
//     "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=400&auto=format&fit=crop",
//     "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400&auto=format&fit=crop",
//     "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=400&auto=format&fit=crop",
//     "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400&auto=format&fit=crop",
//     "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=400&auto=format&fit=crop",
//   ],
//   extraImages: [
//     { src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=800&auto=format&fit=crop", label: "Kitchen" },
//     { src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop", label: "Living Room" },
//     { src: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=800&auto=format&fit=crop", label: "Master Bedroom" },
//     { src: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop", label: "Garden" },
//     { src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop", label: "Exterior" },
//     { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop", label: "Pool" },
//   ],
// };

// // ── Icons ─────────────────────────────────────────────────────────────────────
// const icons = {
//   bed: (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//       <path d="M2 9V19M22 9V19M2 14h20M2 9a5 5 0 015-5h10a5 5 0 015 5" /><path d="M6 14V9M18 14V9" />
//     </svg>
//   ),
//   bath: (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//       <path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z" /><path d="M6 12V6a2 2 0 012-2h1" /><path d="M4 20l-1 2M20 20l1 2" />
//     </svg>
//   ),
//   area: (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//       <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
//     </svg>
//   ),
//   garage: (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//       <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path d="M8 21V12h8v9" />
//     </svg>
//   ),
//   pool: (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//       <path d="M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /><path d="M2 17c2-2 4-2 6 0s4 2 6 0 4-2 6 0" /><path d="M7 4l5 4 5-4" />
//     </svg>
//   ),
//   garden: (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//       <path d="M12 22V12M12 12C12 7 7 4 3 6c0 4 3 7 9 6M12 12c0-5 5-8 9-6-1 4-4 7-9 6" />
//     </svg>
//   ),
//   gym: (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//       <path d="M6 4v16M18 4v16M3 8h3M18 8h3M3 16h3M18 16h3M6 12h12" />
//     </svg>
//   ),
//   security: (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//     </svg>
//   ),
//   location: (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
//       <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" />
//     </svg>
//   ),
//   cube: (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
//       <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
//     </svg>
//   ),
//   expand: (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
//       <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
//     </svg>
//   ),
//   close: (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//       <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
//     </svg>
//   ),
//   arrow: (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
//       <polyline points="9 18 15 12 9 6" />
//     </svg>
//   ),
// };

// // ── Lightbox ──────────────────────────────────────────────────────────────────
// const Lightbox = ({ images, startIndex, onClose }) => {
//   const [idx, setIdx] = useState(startIndex);
//   const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
//   const next = () => setIdx((i) => (i + 1) % images.length);

//   return (
//     <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
//       <button onClick={onClose} className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors">
//         {icons.close}
//       </button>
//       <button onClick={(e) => { e.stopPropagation(); prev(); }}
//         className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
//         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="15 18 9 12 15 6" /></svg>
//       </button>
//       <img
//         src={images[idx].src}
//         alt={images[idx].label}
//         className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl"
//         onClick={(e) => e.stopPropagation()}
//       />
//       <button onClick={(e) => { e.stopPropagation(); next(); }}
//         className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
//         {icons.arrow}
//       </button>
//       <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-sm">
//         {images[idx].label} &nbsp;·&nbsp; {idx + 1} / {images.length}
//       </div>
//     </div>
//   );
// };

// // ── Main Page ─────────────────────────────────────────────────────────────────
// export default function PropertyDetailPage() {
//   const [activeImage, setActiveImage] = useState(property.mainImage);
//   const [lightbox, setLightbox] = useState(null); // { images, index }

//   const allThumbs = [
//     { src: property.mainImage, label: "Main View" },
//     ...property.thumbnails.map((src, i) => ({ src, label: `View ${i + 1}` })),
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//         <div className="container">
//       <div className="mx-auto py-10">

//         {/* ── Breadcrumb ── */}
//         <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
//           <span className="hover:text-gray-700 cursor-pointer transition-colors">Properties</span>
//           <span>/</span>
//           <span className="hover:text-gray-700 cursor-pointer transition-colors">New York</span>
//           <span>/</span>
//           <span className="text-gray-800 font-medium truncate">{property.title}</span>
//         </nav>

//         {/* ── Gallery ── */}
//         <div className="mb-10">
//           {/* Hero image */}
//           <div className="relative rounded-2xl overflow-hidden aspect-[16/7] mb-3 group cursor-pointer"
//             onClick={() => setLightbox({ images: allThumbs, index: allThumbs.findIndex(t => t.src === activeImage) })}>
//             <img src={activeImage} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
//             <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full">
//               {property.badge}
//             </span>
//             <button className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-1.5 hover:bg-black/70 transition-colors">
//               {icons.expand}
//               View full screen
//             </button>
//           </div>

//           {/* Thumbnails */}
//           <div className="flex gap-3 overflow-x-auto pb-1 p-2">
//             {allThumbs.map((thumb, i) => (
//               <button
//                 key={i}
//                 onClick={() => setActiveImage(thumb.src)}
//                 className={`shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
//                   activeImage === thumb.src ? "border-gray-900 scale-105" : "border-transparent hover:border-gray-300"
//                 }`}
//               >
//                 <img src={thumb.src} alt={thumb.label} className="w-full h-full object-cover" />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── Content Layout: Info + Sidebar ── */}
//         <div className="flex gap-10 mb-16">

//           {/* Left: Main Info */}
//           <div className="flex-1 min-w-0 space-y-10">

//             {/* Title block */}
//             <div>
//               <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
//                 {icons.location}
//                 <span>{property.subtitle}</span>
//               </div>
//               <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">{property.title}</h1>
//               <p className="text-gray-500 text-base leading-relaxed">{property.shortDesc}</p>
//             </div>

//             {/* Stats strip */}
//             <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
//               {property.stats.map((s) => (
//                 <div key={s.label} className="bg-gray-50 rounded-xl p-4 text-center">
//                   <p className="text-xl font-bold text-gray-900">{s.value}</p>
//                   <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
//                 </div>
//               ))}
//             </div>

//             {/* Features */}
//             <div>
//               <h2 className="text-xl font-bold text-gray-900 mb-5">Property Features</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                 {property.features.map((f) => (
//                   <div key={f.label} className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-3 hover:border-gray-300 transition-colors">
//                     <span className="text-gray-500">{icons[f.icon]}</span>
//                     <span className="text-sm text-gray-700 font-medium">{f.label}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Long description */}
//             <div>
//               <h2 className="text-xl font-bold text-gray-900 mb-4">About this property</h2>
//               <div className="space-y-4">
//                 {property.longDesc.trim().split("\n\n").map((para, i) => (
//                   <p key={i} className="text-gray-600 text-sm leading-relaxed">{para.trim()}</p>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right: Sticky Price Card */}
//           <aside className="w-80 shrink-0">
//             <div className="sticky top-6 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">
//               <div>
//                 <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{property.priceLabel}</p>
//                 <p className="text-3xl font-bold text-gray-900">{property.price}</p>
//               </div>
//               <div className="border-t border-gray-100 pt-4 space-y-3 text-sm text-gray-600">
//                 <div className="flex justify-between"><span>Type</span><span className="font-medium text-gray-900">House</span></div>
//                 <div className="flex justify-between"><span>Status</span><span className="font-medium text-green-600">Available</span></div>
//                 <div className="flex justify-between"><span>Area</span><span className="font-medium text-gray-900">4,200 sqft</span></div>
//                 <div className="flex justify-between"><span>City</span><span className="font-medium text-gray-900">New York</span></div>
//               </div>
//               <button className="w-full bg-gray-900 hover:bg-gray-700 transition-colors text-white font-semibold text-sm py-3.5 rounded-full">
//                 Request a Viewing
//               </button>
//               <button className="w-full border border-gray-200 hover:border-gray-400 transition-colors text-gray-700 font-semibold text-sm py-3.5 rounded-full">
//                 Contact Agent
//               </button>
//               <div className="border-t border-gray-100 pt-4">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
//                     <img src="https://i.pravatar.cc/80?img=12" alt="Agent" className="w-full h-full object-cover" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-gray-900">Sarah Mitchell</p>
//                     <p className="text-xs text-gray-400">Licensed Agent · NYC</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </aside>
//         </div>

//         {/* ── 3D View Section ── */}
//         <div className="mb-16">
//           <div className="flex items-center gap-3 mb-6">
//             <span className="text-gray-400">{icons.cube}</span>
//             <h2 className="text-xl font-bold text-gray-900">3D Property Tour</h2>
//             <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">Coming Soon</span>
//           </div>

//           {/* 3D viewer placeholder — swap this div for your Three.js canvas */}
//           <div className="relative w-full rounded-2xl overflow-hidden bg-gray-950 aspect-[16/7] flex flex-col items-center justify-center">
//             {/* Subtle grid overlay for depth feel */}
//             <div className="absolute inset-0 opacity-10"
//               style={{
//                 backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
//                 backgroundSize: "48px 48px"
//               }}
//             />
//             <img
//               src={property.mainImage}
//               alt="3D preview placeholder"
//               className="absolute inset-0 w-full h-full object-cover opacity-20"
//             />
//             <div className="relative z-10 flex flex-col items-center gap-3 text-center px-6">
//               <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white mb-1">
//                 {icons.cube}
//               </div>
//               <p className="text-white text-lg font-semibold">Interactive 3D View</p>
//               <p className="text-white/50 text-sm max-w-xs">
//                 The immersive 3D walkthrough will be loaded here using Three.js. Drop your <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">.glb</code> file to get started.
//               </p>
//             </div>
//             {/* TODO: Replace this div's contents with your Three.js canvas:
//                 <canvas ref={canvasRef} className="w-full h-full" />
//             */}
//           </div>
//         </div>

//         {/* ── Interior Images ── */}
//         <div>
//           <h2 className="text-xl font-bold text-gray-900 mb-6">Interior Photos</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//             {property.extraImages.map((img, i) => (
//               <div
//                 key={i}
//                 className="relative group cursor-pointer rounded-2xl overflow-hidden aspect-[4/3]"
//                 onClick={() => setLightbox({ images: property.extraImages, index: i })}
//               >
//                 <img
//                   src={img.src}
//                   alt={img.label}
//                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                 />
//                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
//                   <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
//                     {icons.expand}
//                   </span>
//                 </div>
//                 <div className="absolute bottom-3 left-3">
//                   <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">
//                     {img.label}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//       </div>

//       {/* ── Lightbox ── */}
//       {lightbox && (
//         <Lightbox
//           images={lightbox.images}
//           startIndex={lightbox.index}
//           onClose={() => setLightbox(null)}
//         />
//       )}
//       </div>
//     </div>
//   );
// }