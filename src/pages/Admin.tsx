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
    return <div className="flex items-center justify-center h-full">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto w-full">
      <header className="mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Sistem Yönetimi</h2>
        <p className="text-slate-500">Uygulama genel durumu ve istatistikleri</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="size-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <Server size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Sistem Durumu</p>
            <p className="text-xl font-bold text-slate-900 flex items-center gap-2">
              {stats.status === "online" ? (
                <><span className="size-2.5 rounded-full bg-emerald-500"></span> Aktif</>
              ) : (
                <><span className="size-2.5 rounded-full bg-red-500"></span> Hata</>
              )}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="size-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <Database size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Veritabanı</p>
            <p className="text-xl font-bold text-slate-900">Bağlı</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="size-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Toplam Kullanıcı</p>
            <p className="text-xl font-bold text-slate-900">{stats.userCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="size-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Toplam Viblog</p>
            <p className="text-xl font-bold text-slate-900">{stats.viblogCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Activity size={20} className="text-indigo-500" />
          Sistem Bilgileri
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-500">Node.js Versiyonu</span>
            <span className="font-medium text-slate-900">v22.x</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-500">Prisma Versiyonu</span>
            <span className="font-medium text-slate-900">v5.22.0</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-slate-100">
            <span className="text-slate-500">Master Hesap</span>
            <span className="font-medium text-emerald-600">Aktif (neo)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
