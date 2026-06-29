import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo.png';
export default function Header({ backgroundColor = "transparent" }) {

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  // State to hold the agent user data
  const [agentUser, setAgentUser] = useState(null);
  // Load agent user data from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem("agentUser");
    if (stored) setAgentUser(JSON.parse(stored));
  }, []);

  return (
    <>

      <header className='z-30 py-3' style={{ background: backgroundColor }}>
        <div className='container flex items-center justify-between relative '>
          {/* Logo */}
          <Link to="/" className="w-36 h-auto shrink-0 z-50">
            <img src={logo} alt="Logo" className="h-auto w-full" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1.5">
            {[
              { to: "/", label: "Home" },
              { to: "/allProperties", label: "Properties" },
              { to: "/contact", label: "Contact Us" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${isActive
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-white hover:bg-white/10"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {agentUser ? (
              <NavLink to="/agent/dashboard" className="btn btn-primary">
                View Dashboard
              </NavLink>
            ) : (
              <NavLink to="/agent/login" className="btn btn-primary">
                List Property
              </NavLink>
            )}
          </div>

          {/* Mobile/Tablet: Sign Up + Hamburger */}
          <div className="flex lg:hidden items-center gap-3 z-50">
            <button onClick={toggleMenu} aria-label="Toggle menu"
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
              <span style={{ transform: menuOpen ? 'translateY(8px) rotate(45deg)' : 'none' }}
                className="block w-5 h-0.5 bg-white rounded-full transition-all duration-600 origin-center" />
              <span style={{ opacity: menuOpen ? 0 : 1 }}
                className="block w-5 h-0.5 bg-white rounded-full transition-all duration-600" />
              <span style={{ transform: menuOpen ? 'translateY(-8px) rotate(-45deg)' : 'none' }}
                className="block w-5 h-0.5 bg-white rounded-full transition-all duration-600 origin-center" />
            </button>
          </div>

          {/* Mobile Dropdown Menu — absolutely positioned below header */}
          <div
            className="lg:hidden absolute top-full left-4 right-4 mt-2 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden transition-all duration-600 z-30 "
            style={{ background: backgroundColor, maxHeight: menuOpen ? '400px' : '0', opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none' }}
          >
            <nav className="flex flex-col px-4 py-4 gap-1">
              {[
                { to: "/", label: "Home" },
                { to: "/contact", label: "Contact Us" },
                { to: "/allProperties", label: "Properties" },
              ].map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-white hover:bg-white/15"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <div className="border-t border-white/20 my-2" />
              {agentUser ? (
                <NavLink to="/agent/dashboard" className="btn btn-primary">
                  View Dashboard
                </NavLink>
              ) : (
                <NavLink to="/agent/login" className="btn btn-primary">
                  List Property
                </NavLink>
              )}
            </nav>
          </div>
        </div>
      </header>


    </>
  )
}
