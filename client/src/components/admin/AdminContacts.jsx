import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

const Icon = ({ d, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const mailIcon = "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6";
const trashIcon = "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16";

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_URL}/contact`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setContacts(data.contacts);
    } catch {
      toast.error("Failed to load contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const res = await fetch(`${API_URL}/contact/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setContacts(prev => prev.map(c => c._id === id ? { ...c, read: true } : c));
        toast.success("Marked as read.");
      }
    } catch {
      toast.error("Failed to update.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/contact/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setContacts(prev => prev.filter(c => c._id !== id));
        toast.success("Contact deleted.");
      }
    } catch {
      toast.error("Failed to delete.");
    }
  };

  const unreadCount = contacts.filter(c => !c.read).length;

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
        <h1 className="text-2xl font-bold text-gray-900">Contact Enquiries</h1>
        <p className="text-sm text-gray-400 mt-0.5">{unreadCount} unread messages</p>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-24 text-gray-400 text-sm">No contact enquiries yet.</div>
      ) : (
        <div className="space-y-3">
          {contacts.map(c => (
            <div
              key={c._id}
              className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${c.read ? "border-gray-100" : "border-gray-300"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-gray-500 font-bold text-sm">
                    {c.firstName?.charAt(0)}{c.lastName?.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Name + unread dot */}
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-semibold text-gray-900 text-sm">
                        {c.firstName} {c.lastName}
                      </span>
                      {!c.read && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}
                    </div>

                    {/* Email + Phone */}
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Icon d={mailIcon} size={11} />{c.email}
                      </span>
                      {c.phone && <span>{c.phone}</span>}
                    </div>

                    {/* Subject */}
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      Subject: {c.subject}
                    </p>

                    {/* Message */}
                    <p className="text-sm text-gray-600 leading-relaxed">{c.message}</p>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="text-xs text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>

                  {!c.read ? (
                    <button
                      onClick={() => handleMarkRead(c._id)}
                      className="text-xs font-medium text-gray-500 border border-gray-200 hover:border-gray-400 px-3 py-1 rounded-full transition-colors"
                    >
                      Mark read
                    </button>
                  ) : (
                    <span className="text-xs text-gray-300 font-medium">Read</span>
                  )}

                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Icon d={trashIcon} size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}