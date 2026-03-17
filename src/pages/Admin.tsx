import { useState, useEffect } from "react";
import { Activity, Users, Database, Server, FileText } from "lucide-react";

export default function Admin() {
  const [stats, setStats] = useState({ userCount: 0, viblogCount: 0, status: "checking" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setStats({ userCount: 0, viblogCount: 0, status: "error" });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full dark:text-white">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <header className="mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Sistem Yönetimi</h2>
        <p className="text-slate-500 dark:text-slate-400">Uygulama genel durumu ve istatistikleri</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Server size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Sistem Durumu</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {stats.status === "online" ? (
                <><span className="size-2.5 rounded-full bg-emerald-500"></span> Aktif</>
              ) : (
                <><span className="size-2.5 rounded-full bg-red-500"></span> Hata</>
              )}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="size-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Database size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Veritabanı</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">Bağlı</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="size-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Toplam Kullanıcı</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.userCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
          <div className="size-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-400">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Toplam Viblog</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.viblogCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity size={20} className="text-indigo-500 dark:text-indigo-400" />
          Sistem Bilgileri
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">Node.js Versiyonu</span>
            <span className="font-medium text-slate-900 dark:text-white">v22.x</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">Prisma Versiyonu</span>
            <span className="font-medium text-slate-900 dark:text-white">v5.22.0</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">Master Hesap</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">Aktif (neo)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
