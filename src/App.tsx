import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import CreateViblog from "./pages/CreateViblog";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Setup from "./pages/Setup";
import { useState, useEffect } from "react";

export default function App() {
  const [user, setUser] = useState<{ id: number; name: string; email: string; isAdmin?: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "setup-required">("checking");

  useEffect(() => {
    const checkSystem = async () => {
      try {
        const res = await fetch("/api/system/status");
        const data = await res.json();
        setDbStatus(data.status);
      } catch (e) {
        setDbStatus("setup-required");
      }
    };
    checkSystem();
  }, []);

  useEffect(() => {
    if (dbStatus === "connected") {
      const storedUser = localStorage.getItem("vibeloggers_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    } else if (dbStatus === "setup-required") {
      setLoading(false);
    }
  }, [dbStatus]);

  const handleLogout = () => {
    localStorage.removeItem("vibeloggers_user");
    setUser(null);
  };

  if (loading || dbStatus === "checking") {
    return <div className="min-h-screen flex items-center justify-center bg-[#f6f8f6] dark:bg-slate-900 dark:text-white transition-colors duration-200">Sistem kontrol ediliyor...</div>;
  }

  if (dbStatus === "setup-required") {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Setup />} />
        </Routes>
      </BrowserRouter>
    );
  }

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-[#f6f8f6] dark:bg-slate-900 text-slate-900 dark:text-white font-sans transition-colors duration-200">
        <Sidebar user={user} />
        <main className="flex-1 ml-72 p-8 lg:p-12 flex flex-col h-screen overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/create" element={<CreateViblog user={user} />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/settings" element={<Settings onLogout={handleLogout} />} />
            {user.isAdmin && <Route path="/admin" element={<Admin />} />}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
