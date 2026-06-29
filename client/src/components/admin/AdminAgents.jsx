import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch(`${API_URL}/agent`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setAgents(data.agents);
      } catch {
        toast.error("Failed to load agents.");
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <svg className="animate-spin w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Agents</h1>
        <p className="text-sm text-gray-400 mt-0.5">{agents.length} registered agents</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {["Agent", "Email", "Phone", "City", "Agency", "Joined"].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {agents.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-16 text-sm">No agents registered yet.</td>
              </tr>
            ) : (
              agents.map(a => (
                <tr key={a._id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-600 font-bold text-sm">
                        {a.name?.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-900">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{a.email}</td>
                  <td className="px-5 py-4 text-gray-500">{a.phone || "—"}</td>
                  <td className="px-5 py-4 text-gray-600">{a.city || "—"}</td>
                  <td className="px-5 py-4 text-gray-600">{a.agencyName || "—"}</td>
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}