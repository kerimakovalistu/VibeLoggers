import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, AlertCircle } from "lucide-react";

const EMOTIONS = [
  { label: "Mutlu", color: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/50" },
  { label: "Nostaljik", color: "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/50" },
  { label: "Karmaşık", color: "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/50" },
  { label: "Sakin", color: "bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800 dark:hover:bg-teal-900/50" },
  { label: "Heyecanlı", color: "bg-pink-50 text-pink-600 border-pink-100 hover:bg-pink-100 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800 dark:hover:bg-pink-900/50" },
];

export default function CreateViblog({ user }: { user: { id: number } }) {
  const navigate = useNavigate();
  const [triggerText, setTriggerText] = useState("");
  const [feelingText, setFeelingText] = useState("");
  const [emotionTag, setEmotionTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!triggerText || !feelingText || !emotionTag) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/viblogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          triggerText,
          feelingText,
          emotionTag,
          userId: user.id,
        }),
      });

      if (res.ok) {
        navigate("/feed");
      } else {
        const data = await res.json();
        setError(data.error || "Bir hata oluştu.");
      }
    } catch (error) {
      console.error(error);
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <header className="mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight dark:text-white">Yeni Viblog Oluştur</h2>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-1.5 w-12 bg-[#13ec5b] rounded-full"></div>
          <div className="h-1.5 w-12 bg-[#13ec5b]/20 rounded-full"></div>
          <div className="h-1.5 w-12 bg-[#13ec5b]/20 rounded-full"></div>
          <span className="text-slate-500 dark:text-slate-400 text-sm ml-2">Adım 1: Duygularını İfade Et</span>
        </div>
      </header>

      <div className="space-y-10 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 border border-red-100 dark:border-red-800">
            <AlertCircle size={20} />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        <section className="space-y-4">
          <label className="block text-lg font-bold dark:text-white">Ne Yaşadın? (Olay / Durum)</label>
          <input
            value={triggerText}
            onChange={(e) => setTriggerText(e.target.value)}
            className="block w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-[#13ec5b]/50 transition-all text-base"
            placeholder="Örn: Boğaz Köprüsü, Bir Şarkı..."
            type="text"
          />
        </section>

        <section className="space-y-4">
          <label className="block text-lg font-bold dark:text-white">Ne Hissettin?</label>
          <textarea
            value={feelingText}
            onChange={(e) => setFeelingText(e.target.value)}
            className="block w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-[#13ec5b]/50 transition-all text-base min-h-[160px] resize-none"
            placeholder="Duygularını buraya dök..."
          ></textarea>
        </section>

        <section className="space-y-4">
          <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hissini Etiketle</label>
          <div className="flex flex-wrap gap-3">
            {EMOTIONS.map((emotion) => (
              <button
                key={emotion.label}
                onClick={() => setEmotionTag(emotion.label)}
                className={`px-5 py-2.5 rounded-full border transition-colors font-medium text-sm flex items-center gap-2 ${
                  emotionTag === emotion.label ? "ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-500 " + emotion.color : emotion.color
                }`}
              >
                {emotion.label}
              </button>
            ))}
          </div>
        </section>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="group flex items-center gap-2 px-10 py-4 bg-[#FCE4EC] dark:bg-pink-900/30 hover:bg-[#F8BBD0] dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-400 font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-pink-100 dark:shadow-none disabled:opacity-50"
          >
            <span>{isSubmitting ? "Kaydediliyor..." : "Viblogla!"}</span>
            <Send size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
