import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const formatPrice = (price) => {
  return "₹" + Number(price).toLocaleString("en-IN");
};

const PropertyCard = ({ property }) => {
  const thumbnail = property.images?.[0]
    ? `${property.images[0]}`
    : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600";

  return (
    <div className="flex flex-col gap-3 group cursor-pointer">
      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
        <img
          src={thumbnail}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm capitalize">
          For {property.listingType}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-green-600 transition-colors">
        {property.title}
      </h3>

      {/* Price & Location */}
      <p className="text-sm text-gray-700">
        <span className="font-bold text-gray-900">
          {formatPrice(property.price)}
        </span>

        <span className="text-gray-400 mx-2">•</span>

        <span className="text-gray-500">
          {property.city}, {property.state}
        </span>
      </p>
    </div>
  );
};

const ProductsGrid = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(`${API_URL}/property/latest`);

        const data = await res.json();

        if (data.success) {
          setProperties(data.properties);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <section className="bg-white py-14">
      <div className="container">

        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10">
          <div className="max-w-md">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3">
              Explore our premier houses
            </h2>

            <p className="text-gray-500 text-sm leading-relaxed">
              Each listing offers unique features, exceptional quality, and
              prime locations, ensuring an exclusive living experience.
            </p>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            <Link to={"/allProperties"} className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 transition-colors text-white text-sm font-semibold px-6 py-3.5 rounded-full shadow-md whitespace-nowrap">
              See All Properties →
            </Link>
          </div>
        </div>

        {/* Grid */}

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {properties.map((property) => (
              <Link key={property._id} to={`/property/${property._id}`}>
                <PropertyCard property={property} />
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default ProductsGrid;