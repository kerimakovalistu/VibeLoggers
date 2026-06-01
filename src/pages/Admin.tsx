import { useState, useEffect } from "react";
import { Activity, Users, Database, Server, FileText, Ban, Trash2, KeyRound, Shield, AlertCircle } from "lucide-react";

type UserData = { id: number; name: string; email: string; isAdmin: boolean; isBanned: boolean };
type ViblogData = { id: number; triggerText: string; feelingText: string; isDeleted: boolean; createdAt: string; user: { name: string } };
type LogData = { id: number; action: string; details: string; createdAt: string; user?: { name: string } };

export default function Admin({ user }: { user: { id: number } }) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "viblogs" | "logs">("dashboard");
  const [stats, setStats] = useState({ userCount: 0, viblogCount: 0, status: "checking" });
  const [users, setUsers] = useState<UserData[]>([]);
  const [viblogs, setViblogs] = useState<ViblogData[]>([]);
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      if (activeTab === "dashboard") {
        const res = await fetch("/api/admin/stats");
        setStats(await res.json());
      } else if (activeTab === "users") {
        const res = await fetch("/api/admin/users");
        setUsers(await res.json());
      } else if (activeTab === "viblogs") {
        const res = await fetch("/api/admin/viblogs");
        setViblogs(await res.json());
      } else if (activeTab === "logs") {
        const res = await fetch("/api/admin/logs");
        setLogs(await res.json());
      }
    } catch (e) {
      setErrorMessage("Veriler alınırken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (targetUserId: number) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${targetUserId}/ban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activeUserId: user.id })
      });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "İşlem başarısız.");
      }
    } catch (e) {
      setErrorMessage("Bağlantı hatası.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleDelete = async (viblogId: number) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/viblogs/${viblogId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activeUserId: user.id })
      });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "İşlem başarısız.");
      }
    } catch (e) {
      setErrorMessage("Bağlantı hatası.");
    } finally {
      setActionLoading(false);
    }
  };

  const TABS = [
    { id: "dashboard", label: "Genel Bakış", icon: Activity },
    { id: "users", label: "Kullanıcılar", icon: Users },
    { id: "viblogs", label: "İçerikler", icon: FileText },
    { id: "logs", label: "Sistem Logları", icon: Shield },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto w-full">
      <header className="mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Sistem Yönetimi</h2>
        <p className="text-slate-500 dark:text-slate-400">Moderasyon ve istatistik araçları</p>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-medium ${
              activeTab === tab.id 
                ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400" 
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {errorMessage && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-2 border border-red-100 dark:border-red-800">
          <AlertCircle size={20} />
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 dark:text-white font-medium">Yükleniyor...</div>
      ) : activeTab === "dashboard" ? (
        <div className="space-y-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Server size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Sistem</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${stats.status === "online" ? "bg-emerald-500" : "bg-red-500"}`}></span> 
                  {stats.status === "online" ? "Aktif" : "Hata"}
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Kullanıcılar</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.userCount}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className="size-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">İçerikler (Viblogs)</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.viblogCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Database size={20} className="text-indigo-500" /> API ve Veritabanı
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">ORM Mimarisi</span>
                <span className="font-medium text-slate-900 dark:text-white">Prisma Client</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Veritabanı Türü</span>
                <span className="font-medium text-slate-900 dark:text-white">MySQL</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-500 dark:text-slate-400">Altyapı</span>
                <span className="font-medium text-slate-900 dark:text-white">Node.js (Express)</span>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "users" ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">ID</th>
                  <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">İsim</th>
                  <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">E-posta</th>
                  <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Yetki</th>
                  <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Durum</th>
                  <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-slate-500 dark:text-slate-400">#{u.id}</td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{u.name}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{u.email}</td>
                    <td className="p-4">
                      {u.isAdmin ? (
                        <span className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-md text-xs font-bold uppercase">Yönetici</span>
                      ) : (
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-xs font-bold uppercase">Kullanıcı</span>
                      )}
                    </td>
                    <td className="p-4">
                      {u.isBanned ? (
                        <span className="text-red-500 font-medium text-sm flex items-center gap-1"><Ban size={14} /> Yasaklı</span>
                      ) : (
                        <span className="text-emerald-500 font-medium text-sm">Aktif</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {!u.isAdmin && (
                        <button
                          onClick={() => handleToggleBan(u.id)}
                          disabled={actionLoading}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            u.isBanned 
                              ? "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                              : "bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400"
                          } disabled:opacity-50`}
                        >
                          <Ban size={16} />
                          {u.isBanned ? "Yasağı Kaldır" : "Yasakla"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === "viblogs" ? (
        <div className="space-y-4">
          {viblogs.map(v => (
            <div key={v.id} className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row gap-4 justify-between items-start md:items-center ${v.isDeleted ? "bg-slate-50 dark:bg-slate-900/30 border-dashed border-red-200 dark:border-red-900/50 opacity-75" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm"}`}>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">{v.user.name}</span> • {new Date(v.createdAt).toLocaleDateString("tr-TR")}
                  {v.isDeleted && <span className="ml-2 text-red-500 font-bold text-xs uppercase bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">Silindi (Gizlendi)</span>}
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">{v.triggerText}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">"{v.feelingText}"</p>
              </div>
              <button
                onClick={() => handleToggleDelete(v.id)}
                disabled={actionLoading}
                className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  v.isDeleted 
                    ? "bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300"
                    : "bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400"
                } disabled:opacity-50`}
              >
                <Trash2 size={18} />
                {v.isDeleted ? "Geri Getir" : "İçeriği Gizle"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 w-32">Tarih</th>
                  <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 w-48">Kullanıcı (Admin)</th>
                  <th className="p-4 font-semibold text-slate-700 dark:text-slate-300 w-48">Aksiyon</th>
                  <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Detay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-4 text-xs font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("tr-TR")}
                    </td>
                    <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                      {log.user ? log.user.name : <span className="text-slate-400 italic">Sistem</span>}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
