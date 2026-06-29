import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function AgentAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agencyName: "",
    city: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation for signup
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        // ── LOGIN ──────────────────────────────────────────
        const res = await fetch(`${API_URL}/agent/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          toast.error(data.message || "Login failed.");
          return;
        }

        localStorage.setItem("agentToken", data.token);
        localStorage.setItem("agentUser", JSON.stringify(data.agent));

        toast.success("Welcome back!");
        setTimeout(() => navigate("/agent/dashboard"), 1000);

      } else {
        // ── REGISTER ───────────────────────────────────────
        const res = await fetch(`${API_URL}/agent/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            agencyName: formData.agencyName,
            city: formData.city,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          toast.error(data.message || "Registration failed.");
          return;
        }

        localStorage.setItem("agentToken", data.token);
        localStorage.setItem("agentUser", JSON.stringify(data.agent));

        toast.success("Account created! Redirecting...");
        setTimeout(() => navigate("/agent/dashboard"), 1000);
      }

    } catch (err) {
      toast.error("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (toLogin) => {
    setIsLogin(toLogin);
    setFormData({
      name: "", email: "", phone: "",
      password: "", confirmPassword: "",
      agencyName: "", city: "",
    });
  };

  const inputClass =
    "w-full bg-gray-100 rounded-xl px-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-300 focus:bg-white border border-transparent focus:border-gray-300 transition-all duration-200";

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <div className="min-h-screen bg-gray-50 flex">

        {/* ── Left Panel ── */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col justify-between p-12 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={i}
                className="absolute rounded-full border border-white"
                style={{
                  width: `${(i + 1) * 120}px`,
                  height: `${(i + 1) * 120}px`,
                  top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
          </div>

          <div className="z-10 m-auto">
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Manage your properties with ease.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Your all-in-one agent dashboard to list, track, and manage properties — from anywhere.
            </p>
            <div className="flex gap-8 mt-10">
              {[["500+", "Properties Listed"], ["2k+", "Happy Clients"], ["150+", "Cities Covered"]].map(([val, label]) => (
                <div key={label}>
                  <p className="text-white font-bold text-2xl">{val}</p>
                  <p className="text-gray-500 text-xs mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 overflow-y-auto">
          <div className="w-full max-w-md">

            <span className="lg:hidden block font-bold text-gray-900 text-xl mb-8">EstatePro</span>

            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-gray-400 text-sm mb-8">
              {isLogin ? "Sign in to your agent account." : "Join EstatePro as a property agent."}
            </p>

            {/* Toggle tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              {[["Login", true], ["Sign Up", false]].map(([tab, val]) => (
                <button key={tab}
                  onClick={() => switchTab(val)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${isLogin === val
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-400 hover:text-gray-600"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* SIGNUP ONLY FIELDS */}
              {!isLogin && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text" name="name" value={formData.name}
                      onChange={handleChange} placeholder="John Doe"
                      required className={inputClass}
                    />
                  </div>
                </>
              )}

              {/* EMAIL */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</label>
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="john@example.com"
                  required className={inputClass}
                />
              </div>

              {/* SIGNUP ONLY — phone, agency, city */}
              {!isLogin && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone</label>
                    <input
                      type="tel" name="phone" value={formData.phone}
                      onChange={handleChange} placeholder="+1 (555) 000-0000"
                      required className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Agency Name</label>
                      <input
                        type="text" name="agencyName" value={formData.agencyName}
                        onChange={handleChange} placeholder="Realty Co."
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">City</label>
                      <input
                        type="text" name="city" value={formData.city}
                        onChange={handleChange} placeholder="New York"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* PASSWORD */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Password</label>
                <input
                  type="password" name="password" value={formData.password}
                  onChange={handleChange} placeholder="••••••••"
                  required className={inputClass}
                />
              </div>

              {/* CONFIRM PASSWORD — signup only */}
              {!isLogin && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Confirm Password</label>
                  <input
                    type="password" name="confirmPassword" value={formData.confirmPassword}
                    onChange={handleChange} placeholder="••••••••"
                    required className={inputClass}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 active:scale-95 transition-all text-white text-sm font-semibold py-4 rounded-xl shadow-md mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                    </svg>
                    {isLogin ? "Signing in…" : "Creating account…"}
                  </>
                ) : (
                  isLogin ? "Sign In →" : "Create Account →"
                )}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}