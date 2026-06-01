import { useState, useEffect } from "react";
import { Heart, MessageCircle, ArrowRight, Filter, Ghost } from "lucide-react";

type Viblog = {
  id: number;
  triggerText: string;
  feelingText: string;
  emotionTag: string;
  likesCount: number;
  createdAt: string;
  user: { name: string };
  likes?: { userId: number }[];
};

const EMOTION_COLORS: Record<string, string> = {
  "Mutlu": "bg-blue-50 text-blue-500 border-blue-100 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  "Nostaljik": "bg-orange-50 text-orange-500 border-orange-100 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
  "Karmaşık": "bg-purple-50 text-purple-500 border-purple-100 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
  "Sakin": "bg-teal-50 text-teal-500 border-teal-100 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800",
  "Heyecanlı": "bg-pink-50 text-pink-500 border-pink-100 hover:bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800",
};

const EMOTION_EMOJIS: Record<string, string> = {
  "Mutlu": "😊",
  "Nostaljik": "🌅",
  "Karmaşık": "🌪️",
  "Sakin": "🌿",
  "Heyecanlı": "✨",
};

const ALL_EMOTIONS = ["Mutlu", "Nostaljik", "Karmaşık", "Sakin", "Heyecanlı"];

export default function Feed() {
  const [viblogs, setViblogs] = useState<Viblog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [filterEmotion, setFilterEmotion] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("vibeloggers_user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUserId(user.id);
      fetchViblogs(user.id);
    } else {
      fetchViblogs();
    }
  }, []);

  const fetchViblogs = async (userId?: number) => {
    try {
      const url = userId ? `/api/viblogs?userId=${userId}` : "/api/viblogs";
      const res = await fetch(url);
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
    if (!currentUserId) return;
    
    try {
      const res = await fetch(`/api/viblogs/${id}/like`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId })
      });
      
      if (res.ok) {
        const data = await res.json();
        setViblogs((prev) =>
          prev.map((v) => {
            if (v.id === id) {
              const isLiked = data.action === "liked";
              return { 
                ...v, 
                likesCount: data.likesCount,
                likes: isLiked ? [{ userId: currentUserId }] : []
              };
            }
            return v;
          })
        );
      }
    } catch (error) {
      console.error("Failed to like", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full dark:text-white">Yükleniyor...</div>;
  }

  const filteredViblogs = filterEmotion 
    ? viblogs.filter(v => v.emotionTag === filterEmotion)
    : viblogs;

  return (
    <div className="max-w-3xl mx-auto w-full py-8">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight dark:text-white">Topluluk Akışı</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Başkalarının neler hissettiğini keşfet.</p>
        </div>
        
        {/* Filtreler */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full md:w-auto">
          <Filter size={16} className="text-slate-400 shrink-0" />
          <button 
            onClick={() => setFilterEmotion(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${!filterEmotion ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900 border-white' : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            Tümü
          </button>
          {ALL_EMOTIONS.map(emotion => (
            <button
              key={emotion}
              onClick={() => setFilterEmotion(filterEmotion === emotion ? null : emotion)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-1.5 ${
                filterEmotion === emotion 
                  ? "ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-900 " + EMOTION_COLORS[emotion]
                  : EMOTION_COLORS[emotion].replace("bg-", "bg-opacity-50 ")
              }`}
            >
              <span>{EMOTION_EMOJIS[emotion]}</span>
              <span>{emotion}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col gap-6">
        {filteredViblogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <Ghost size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Buralar Çok Issız</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
              {filterEmotion ? `Henüz "${filterEmotion}" hisseden kimse olmamış. Veya belki de ilk sen olmalısın?` : "Henüz hiç viblog yok. Topluluğa hislerini anlatan ilk kişi sen ol!"}
            </p>
            {filterEmotion && (
              <button 
                onClick={() => setFilterEmotion(null)}
                className="text-indigo-500 font-bold hover:underline"
              >
                Tümünü Gör
              </button>
            )}
          </div>
        ) : (
          filteredViblogs.map((viblog) => {
            const isLikedByMe = viblog.likes && viblog.likes.length > 0;
            return (
              <article key={viblog.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold">
                      {viblog.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold dark:text-white">{viblog.user.name}</h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {new Date(viblog.createdAt).toLocaleDateString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFilterEmotion(viblog.emotionTag)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border hover:scale-105 transition-transform flex items-center gap-1 ${EMOTION_COLORS[viblog.emotionTag] || "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}
                  >
                    <span>{EMOTION_EMOJIS[viblog.emotionTag] || ""}</span>
                    <span>{viblog.emotionTag}</span>
                  </button>
                </div>
                
                <div className="mb-4">
                  <p className="text-lg font-bold mb-1 dark:text-white">Olay / Durum: {viblog.triggerText}</p>
                  <p className="text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed">"{viblog.feelingText}"</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleLike(viblog.id)} 
                      className={`flex items-center gap-1.5 transition-colors ${isLikedByMe ? 'text-pink-500' : 'text-slate-500 dark:text-slate-400 hover:text-pink-500'}`}
                    >
                      <Heart size={20} fill={isLikedByMe ? "currentColor" : "none"} className={isLikedByMe ? "scale-110 transition-transform" : "transition-transform"} />
                      <span className="text-xs font-medium">{viblog.likesCount}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors opacity-50 cursor-not-allowed" title="Yorumlar yakında eklenecek!">
                      <MessageCircle size={20} />
                      <span className="text-xs font-medium">Yakında</span>
                    </button>
                  </div>
                  <button className="text-[#13ec5b] text-xs font-bold flex items-center gap-1 opacity-50 cursor-not-allowed" title="Detay sayfası yakında eklenecek!">
                    Detaylar <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
