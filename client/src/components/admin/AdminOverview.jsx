import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const revenueData = [
  { month: "Jan", revenue: 1.2 }, { month: "Feb", revenue: 1.8 }, { month: "Mar", revenue: 1.5 },
  { month: "Apr", revenue: 2.1 }, { month: "May", revenue: 1.9 }, { month: "Jun", revenue: 2.4 },
];
const typeData = [
  { name: "Houses", value: 49, color: "#111827" },
  { name: "Apartments", value: 30, color: "#6b7280" },
  { name: "Commercial", value: 21, color: "#d1d5db" },
];

const StatCard = ({ label, value, pct, up = true }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
    <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">{label}</p>
    <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${up ? "text-emerald-600" : "text-red-500"}`}>
      
    </span>
  </div>
);

export default function AdminOverview() {
  const [stats, setStats] = useState({
    total: 0, pending: 0, approved: 0, agents: 0,
  });
  const [listingsData, setListingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [propRes, agentRes] = await Promise.all([
          fetch(`${API_URL}/property`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/agent`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const propData = await propRes.json();
        const agentData = await agentRes.json();

        if (propData.success) {
          const props = propData.properties;
          const pending = props.filter(p => p.status === "pending" || !p.status).length;
          const approved = props.filter(p => p.status === "approved").length;
          setStats({
            total: props.length,
            pending,
            approved,
            agents: agentData.success ? agentData.agents.length : 0,
          });

          // Build listings chart by month
          const monthMap = {};
          props.forEach(p => {
            const month = new Date(p.createdAt).toLocaleString("default", { month: "short" });
            if (!monthMap[month]) monthMap[month] = { month, approved: 0, pending: 0 };
            if (p.status === "approved") monthMap[month].approved++;
            else monthMap[month].pending++;
          });
          setListingsData(Object.values(monthMap).slice(-6));
        }
      } catch {
        toast.error("Failed to load stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Platform overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Properties" value={loading ? "—" : stats.total} />
        <StatCard label="Pending Approval" value={loading ? "—" : stats.pending} />
        <StatCard label="Approved" value={loading ? "—" : stats.approved}  />
        <StatCard label="Total Agents" value={loading ? "—" : stats.agents}  />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-1">Monthly Revenue</h2>
          <p className="text-xs text-gray-400 mb-5">Platform earnings in $M</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
              <Tooltip formatter={v => [`$${v}M`, "Revenue"]} contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" stroke="#111827" strokeWidth={2.5} dot={{ fill: "#111827", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-1">Property Types</h2>
          <p className="text-xs text-gray-400 mb-4">Distribution</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                {typeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v, name) => [`${v}%`, name]} contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {typeData.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-gray-600">{d.name}</span>
                </span>
                <span className="font-semibold text-gray-900">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Listings bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-bold text-gray-900 mb-1">Listings Activity</h2>
        <p className="text-xs text-gray-400 mb-5">Approved vs. pending per month</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={listingsData.length > 0 ? listingsData : [{ month: "—", approved: 0, pending: 0 }]} barGap={4} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
            <Bar dataKey="approved" name="Approved" fill="#111827" radius={[6, 6, 0, 0]} />
            <Bar dataKey="pending" name="Pending" fill="#d1d5db" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-5 mt-3">
          <span className="flex items-center gap-2 text-xs text-gray-500"><span className="w-3 h-3 rounded-sm bg-gray-900 inline-block" /> Approved</span>
          <span className="flex items-center gap-2 text-xs text-gray-500"><span className="w-3 h-3 rounded-sm bg-gray-300 inline-block" /> Pending</span>
        </div>
      </div>
    </div>
  );
}