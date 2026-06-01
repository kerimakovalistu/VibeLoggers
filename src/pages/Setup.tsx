import { useState } from "react";
import { Database, ShieldAlert, CheckCircle2, ServerCrash, User, Mail, Lock } from "lucide-react";

export default function Setup() {
  const [dbUrl, setDbUrl] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbUrl || !adminName || !adminEmail || !adminPassword) {
      setStatus({ type: "error", message: "Lütfen tüm veritabanı ve admin alanlarını doldurun." });
      return;
    }

    setLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ databaseUrl: dbUrl, adminName, adminEmail, adminPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: data.message + " Yönlendiriliyorsunuz..." });
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setStatus({ type: "error", message: data.error || "Kurulum başarısız oldu." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Sunucuya bağlanılamadı." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-200 py-10 overflow-y-auto">
      <div className="max-w-xl w-full bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8 my-auto">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="size-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 border border-indigo-500/30">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Sistem Kurulumu</h2>
          <p className="text-slate-400 mt-2">
            Veritabanı bağlantısını yapılandırın ve ilk yönetici hesabını oluşturun.
          </p>
        </div>

        {status.type !== "idle" && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${
              status.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {status.type === "success" ? <CheckCircle2 size={20} className="mt-0.5 shrink-0" /> : <ServerCrash size={20} className="mt-0.5 shrink-0" />}
            <p className="font-medium text-sm leading-relaxed">{status.message}</p>
          </div>
        )}

        <form onSubmit={handleSetup} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">1. Veritabanı Bağlantısı</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <Database size={16} />
                SQL Connection String (URL)
              </label>
              <input
                type="text"
                required
                value={dbUrl}
                onChange={(e) => setDbUrl(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-200 font-mono text-sm placeholder:text-slate-600"
                placeholder="mysql://user:password@host:port/database"
              />
              <p className="text-xs text-slate-500 mt-2">
                Örnek: <code className="text-indigo-400">mysql://root:123456@localhost:3306/vibeloggers</code>
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">2. Yönetici (Admin) Hesabı</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <User size={16} /> Kullanıcı Adı
                </label>
                <input
                  type="text"
                  required
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-200 text-sm placeholder:text-slate-600"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Mail size={16} /> E-Posta
                </label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-200 text-sm placeholder:text-slate-600"
                  placeholder="admin@vibeloggers.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                  <Lock size={16} /> Şifre
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-200 text-sm placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
            <h4 className="text-sm font-bold text-slate-300 mb-2">Bu işlem neleri kapsar?</h4>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Veritabanı bağlantısı test edilir ve tablolar oluşturulur.</li>
              <li>Sistemi yönetecek yetkili hesap güvenle oluşturulur.</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-900/20 disabled:opacity-50 flex justify-center items-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                Kuruluyor...
              </>
            ) : (
              "Sistemi Kur ve Hesabı Oluştur"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
