import ctaBg from "../assets/cta-img.jpg"; 
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="relative w-full overflow-hidden mx-auto py-20">

      {/* Background Image */}
      <img
        src={ctaBg}
        alt="Dream Property"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 md:px-6 gap-4">
        <h2 className="heading-lg text-white leading-tight max-w-2xl">
          Ready to Make Your Dream Property a Reality?
        </h2>
        <p className="text-white/75 text-sm lg:text-base max-w-md">
          Explore a curated selection of properties that align with your vision and goals.
        </p>
        <Link to="/allProperties" className="mt-2 inline-flex items-center gap-2 bg-white hover:bg-gray-100 transition-colors text-gray-900 text-sm font-semibold px-6 py-3 rounded-full shadow-md">
          Get Started →
        </Link>
      </div>

    </section>
  );
};

export default CTA;