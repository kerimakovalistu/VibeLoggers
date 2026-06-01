import { Link } from "react-router-dom";
import { Heart, Compass, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const QUOTES = [
  "Duygular, ruhun en dürüst dilidir.",
  "Bugün hissettiklerin, yarınki seni şekillendirir.",
  "Her duygu yaşanmayı hak eder, sadece bir an için olsa bile.",
  "İçindeki sesi dinle, o sana her zaman gerçeği söyler.",
  "Nefes al ve anı yaşa, hislerinle barış.",
];

export default function Dashboard({ user }: { user: { name: string } }) {
  const [quote, setQuote] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Günaydın");
    else if (hour < 18) setGreeting("İyi günler");
    else setGreeting("İyi akşamlar");
  }, []);

  return (
    <div className="flex flex-col h-full">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {greeting}, <span className="text-[#13ec5b]">{user.name.split(' ')[0]}</span>!
          </h2>
          <p className="text-slate-500 dark:text-slate-400">Bugün kendini nasıl hissediyorsun?</p>
        </div>
        
        <div className="hidden md:flex items-center gap-3 bg-white dark:bg-slate-800 px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm max-w-sm">
          <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-full shrink-0">
            <Sparkles size={20} />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic">
            "{quote}"
          </p>
        </div>
      </header>
      
      <div className="flex-1 flex flex-col lg:flex-row gap-8 items-stretch justify-center max-w-6xl w-full mb-12">
        <Link
          to="/create"
          className="flex-1 group relative flex flex-col items-center justify-center gap-6 p-12 rounded-3xl bg-gradient-to-br from-[#FCE4EC] to-pink-50 dark:from-pink-900/30 dark:to-slate-800 border border-pink-100 dark:border-pink-900/50 hover:border-pink-300 dark:hover:border-pink-700 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-pink-100 dark:hover:shadow-pink-900/20"
        >
          <div className="size-24 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-pink-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
            <Heart size={48} fill="currentColor" />
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-pink-700 dark:text-pink-400 tracking-wide uppercase">BİR ŞEY HİSSETTİM!</span>
            <p className="mt-2 text-pink-600/70 dark:text-pink-500/70 font-medium">Duygularını şimdi kaydet</p>
          </div>
        </Link>
        <Link
          to="/feed"
          className="flex-1 group relative flex flex-col items-center justify-center gap-6 p-12 rounded-3xl bg-gradient-to-br from-[#E8F5E9] to-green-50 dark:from-green-900/30 dark:to-slate-800 border border-green-100 dark:border-green-900/50 hover:border-green-300 dark:hover:border-green-700 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-green-100 dark:hover:shadow-green-900/20"
        >
          <div className="size-24 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-[#13ec5b] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shadow-sm">
            <Compass size={48} fill="currentColor" />
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-green-700 dark:text-green-400 tracking-wide uppercase">NE HİSSETTİLER?</span>
            <p className="mt-2 text-green-600/70 dark:text-green-500/70 font-medium">Dünyadaki hisleri keşfet</p>
          </div>
        </Link>
      </div>

      {quote && (
        <div className="md:hidden flex items-center gap-3 bg-white dark:bg-slate-800 px-5 py-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm relative -mt-4">
          <div className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-500 rounded-full shrink-0">
            <Sparkles size={16} />
          </div>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 italic">
            "{quote}"
          </p>
        </div>
      )}
    </div>
  );
}
