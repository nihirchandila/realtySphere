import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function AgentProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);

useEffect(() => {
  const verify = async () => {
    const token = localStorage.getItem("agentToken");
    if (!token) {
      window.location.href = "/agent/login";
      return;
    }

    try {
      const res = await fetch(`${API_URL}/agent/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setValid(true);
      } else {
        localStorage.removeItem("agentToken");
        localStorage.removeItem("agentUser");
        window.location.href = "/agent/login";
      }
    } catch (err) {
      window.location.href = "/agent/login";
    } finally {
      setChecking(false);
    }
  };

  verify();
}, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
          </svg>
          <p className="text-sm text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  return valid ? children : null;
}