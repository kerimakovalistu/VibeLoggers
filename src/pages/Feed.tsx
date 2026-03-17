import { useState, useEffect } from "react";
import { Heart, MessageCircle, ArrowRight } from "lucide-react";

type Viblog = {
  id: number;
  triggerText: string;
  feelingText: string;
  emotionTag: string;
  likesCount: number;
  createdAt: string;
  user: { name: string };
};

const EMOTION_COLORS: Record<string, string> = {
  "Mutlu": "bg-orange-50 text-orange-500",
  "Nostaljik": "bg-blue-50 text-blue-500",
  "Karmaşık": "bg-purple-50 text-purple-500",
  "Sakin": "bg-teal-50 text-teal-500",
  "Heyecanlı": "bg-pink-50 text-pink-500",
};

export default function Feed() {
  const [viblogs, setViblogs] = useState<Viblog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchViblogs();
  }, []);

  const fetchViblogs = async () => {
    try {
      const res = await fetch("/api/viblogs");
      if (res.ok) {
        const data = await res.json();
        setViblogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch viblogs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: number) => {
    try {
      const res = await fetch(`/api/viblogs/${id}/like`, { method: "POST" });
      if (res.ok) {
        setViblogs((prev) =>
          prev.map((v) => (v.id === id ? { ...v, likesCount: v.likesCount + 1 } : v))
        );
      }
    } catch (error) {
      console.error("Failed to like", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto w-full py-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Topluluk Akışı</h2>
      </header>

      <div className="flex flex-col gap-6">
        {viblogs.length === 0 ? (
          <p className="text-slate-500 text-center py-10">Henüz hiç viblog yok. İlk sen yaz!</p>
        ) : (
          viblogs.map((viblog) => (
            <article key={viblog.id} className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                    {viblog.user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{viblog.user.name}</h3>
                    <p className="text-[10px] text-slate-500">
                      {new Date(viblog.createdAt).toLocaleDateString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${EMOTION_COLORS[viblog.emotionTag] || "bg-slate-100 text-slate-600"}`}>
                  {viblog.emotionTag}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-lg font-bold mb-1">Tetikleyici: {viblog.triggerText}</p>
                <p className="text-slate-600 italic text-sm leading-relaxed">"{viblog.feelingText}"</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex gap-4">
                  <button onClick={() => handleLike(viblog.id)} className="flex items-center gap-1.5 text-slate-500 hover:text-pink-500 transition-colors">
                    <Heart size={20} />
                    <span className="text-xs font-medium">{viblog.likesCount}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-slate-500 hover:text-blue-500 transition-colors opacity-50 cursor-not-allowed" title="Yorumlar yakında eklenecek!">
                    <MessageCircle size={20} />
                    <span className="text-xs font-medium">Yakında</span>
                  </button>
                </div>
                <button className="text-[#13ec5b] text-xs font-bold flex items-center gap-1 opacity-50 cursor-not-allowed" title="Detay sayfası yakında eklenecek!">
                  Detaylar <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
