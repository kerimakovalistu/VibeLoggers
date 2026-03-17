import { User } from "lucide-react";
import { useState, useEffect } from "react";

type Viblog = {
  id: number;
  triggerText: string;
  feelingText: string;
  emotionTag: string;
  likesCount: number;
  createdAt: string;
};

export default function Profile({ user }: { user: { id: number; name: string; email: string } }) {
  const [stats, setStats] = useState({ viblogCount: 0, totalLikes: 0, recentViblogs: [] as Viblog[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/users/${user.id}/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user.id]);

  return (
    <div className="max-w-3xl mx-auto w-full py-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Profilim</h2>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="size-32 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 border-4 border-white dark:border-slate-800 shadow-lg">
            <User size={64} />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{user.email}</p>
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              Premium Üye
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto mt-6 md:mt-0">
            <div className="flex-1 md:flex-none bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 text-center min-w-[100px]">
              <p className="text-3xl font-bold text-[#13ec5b]">
                {loading ? "..." : stats.viblogCount}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase mt-1">Viblog</p>
            </div>
            <div className="flex-1 md:flex-none bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 text-center min-w-[100px]">
              <p className="text-3xl font-bold text-pink-500">
                {loading ? "..." : stats.totalLikes}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase mt-1">Beğeni</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700">
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Son Viblogların</h4>
          
          {loading ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400">Yükleniyor...</p>
            </div>
          ) : stats.recentViblogs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400">Henüz hiç viblog paylaşmadın.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentViblogs.map((viblog) => (
                <div key={viblog.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-900 dark:text-white">{viblog.triggerText}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(viblog.createdAt).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{viblog.feelingText}"</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="px-2 py-1 bg-white dark:bg-slate-800 rounded-md text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {viblog.emotionTag}
                    </span>
                    <span className="text-xs text-pink-500 font-medium flex items-center gap-1">
                      ♥ {viblog.likesCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
