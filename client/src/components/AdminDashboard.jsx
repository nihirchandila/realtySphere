import { useState, useEffect } from "react";
import AdminOverview from "../components/admin/AdminOverview";
import AdminProperties from "../components/admin/AdminProperties";
import AdminAgents from "../components/admin/AdminAgents";
import AdminContacts from "../components/admin/AdminContacts";

const API_URL = import.meta.env.VITE_API_URL;

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  check: "M20 6L9 17l-5-5",
  pending: "M12 2a10 10 0 100 20A10 10 0 0012 2zm0 6v4l3 3",
  agents: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  contacts: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  home: "M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9",
};

export default function AdminDashboard() {
  const [page, setPage] = useState("dashboard");
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [adminUser, setAdminUser] = useState({});
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) setAdminUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [contactRes, propRes] = await Promise.all([
          fetch(`${API_URL}/contact`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/property`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const contactData = await contactRes.json();
        const propData = await propRes.json();

        if (contactData.success) {
          setUnreadCount(contactData.contacts.filter(c => !c.read).length);
        }
        if (propData.success) {
          setPendingCount(propData.properties.filter(p => p.status === "pending" || !p.status).length);
        }
      } catch {}
    };
    fetchCounts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: icons.dashboard },
    { key: "approved", label: "Approved Properties", icon: icons.check },
    { key: "pending", label: "Pending Approval", icon: icons.pending, badge: pendingCount },
    { key: "agents", label: "All Agents", icon: icons.agents },
    { key: "contacts", label: "Contact Enquiries", icon: icons.contacts, badge: unreadCount },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 bg-white border-r border-gray-100 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            {/* <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
              <Icon d={icons.home} size={14} />
            </div> */}
            <span className="font-bold text-gray-900 text-sm tracking-tight">Realty Sphere Admin</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setPage(item.key)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                page === item.key
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className={page === item.key ? "text-white" : "text-gray-400"}>
                  <Icon d={item.icon} size={16} />
                </span>
                {item.label}
              </span>
              {item.badge > 0 && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${page === item.key ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {adminUser.username?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{adminUser.username || "Admin"}</p>
              <p className="text-xs text-gray-400 truncate">{adminUser.role || "admin"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <Icon d={icons.logout} size={16} />
            Log out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-6xl">
          {page === "dashboard" && <AdminOverview />}
          {page === "approved" && <AdminProperties filter="approved" />}
          {page === "pending" && <AdminProperties filter="pending" />}
          {page === "agents" && <AdminAgents />}
          {page === "contacts" && <AdminContacts />}
        </div>
      </main>
    </div>
  );
}