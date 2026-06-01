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
  const [dbStatus, setDbStatus] = useState<"checking" | "connected" | "setup-required" | "db-error">("checking");

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
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && (parsed.id === 0 || parsed.email === "master@vibeloggers.local")) {
            localStorage.removeItem("vibeloggers_user");
            setUser(null);
          } else {
            setUser(parsed);
          }
        } catch(e) {
          localStorage.removeItem("vibeloggers_user");
        }
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

  if (dbStatus === "db-error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-200 p-4 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Veritabanı Hatası</h1>
        <p className="text-slate-400 mb-8 max-w-md">
          Uygulama sunucusu yapılandırılmış ancak veritabanına ulaşılamıyor. Lütfen veritabanınızın (MySQL) çalıştığından ve erişilebilir olduğundan emin olun.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all text-white"
        >
          Tekrar Dene
        </button>
      </div>
    );
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
            {user.isAdmin && <Route path="/admin" element={<Admin user={user} />} />}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
