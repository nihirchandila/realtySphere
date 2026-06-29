import Logo from "../assets/logo-black.png";
import { Link } from "react-router-dom";


const Footer = () => {

 const leftLinks = [
  { to: "/", label: "Home" },
  { to: "/allProperties", label: "Properties" },
  { to: "/contact", label: "Contact Us" },
];

const rightLinks = [
  { to: "/agent/dashboard", label: "Agent Login" },
  { to: "/admin/dashboard", label: "Admin Login" },
];

  return (
    <footer className="bg-gray-50 border-t border-[#d1d1d1]">
      <div className="container">
      

      {/* ── Top Info Row ── */}
      <div className="py-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-gray-200">
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-lg">
          Discover Nature's{" "}
          <span className="font-light text-gray-400">Wonders</span>
          <br />
          with Expert Guidance
        </h2>
        <div className="text-right">
          <p className="text-gray-500 text-sm leading-relaxed mb-2">
            12345, Faridabad, Haryana,<br />India.
          </p>
          <p className="text-gray-900 font-bold text-base">+91  971125561</p>
        </div>
      </div>

      {/* ── Nav Row ── */}
      <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200">
        {/* Left nav */}
        <nav className="flex items-center gap-6">
          {leftLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-500 text-sm hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Logo center */}
        <img src={Logo} alt="Logo" className="h-10 w-auto" />

        {/* Right nav */}
        <nav className="flex items-center gap-6">
          {rightLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-500 text-sm hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-gray-400 text-xs">
          © 2026 <span className="font-semibold text-gray-600">Realty Sphere</span>. All rights reserved.
        </p>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <a href="#" className="hover:text-gray-700 transition-colors">Terms & Conditions</a>
          <span className="mx-1">|</span>
          <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a>
        </div>
      </div>
      </div>

    </footer>
  );
};

export default Footer;