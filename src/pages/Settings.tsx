import { useState, useEffect } from "react";
import { Shield, Moon, LogOut, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";

export default function Settings({ onLogout }: { onLogout: () => void }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({ type: "idle", message: "" });

  useEffect(() => {
    // Check initial dark mode state
    if (document.documentElement.classList.contains("dark") || localStorage.getItem("theme") === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;

    setLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      const storedUser = localStorage.getItem("vibeloggers_user");
      if (!storedUser) throw new Error("Kullanıcı bulunamadı");
      const user = JSON.parse(storedUser);

      const res = await fetch(`/api/users/${user.id}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Şifreniz başarıyla güncellendi." });
        setOldPassword("");
        setNewPassword("");
      } else {
        setStatus({ type: "error", message: data.error || "Şifre güncellenemedi." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Bağlantı hatası." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full py-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Ayarlar</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Hesap ve uygulama tercihlerini yönet.</p>
      </header>

      <div className="space-y-6">
        {/* Görünüm */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <Moon size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Görünüm</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Karanlık Mod</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Göz yormayan karanlık tema.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isDarkMode} onChange={toggleDarkMode} />
                <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13ec5b]"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Şifre Değiştirme */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <KeyRound size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Şifre Değiştir</h3>
          </div>
          <div className="p-6">
            {status.type !== "idle" && (
              <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${
                status.type === "success" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800" : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800"
              }`}>
                {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <p className="font-medium text-sm">{status.message}</p>
              </div>
            )}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Mevcut Şifre</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#13ec5b]/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Yeni Şifre</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#13ec5b]/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-6 py-3 bg-[#13ec5b] hover:bg-[#10d451] text-white font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 mt-2"
              >
                {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
              </button>
            </form>
          </div>
        </section>

        {/* Güvenlik & Çıkış */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-3">
            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
              <Shield size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Oturum</h3>
          </div>
          <div className="p-6">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/30 px-4 py-3 rounded-xl transition-colors w-full md:w-auto"
            >
              <LogOut size={20} />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
