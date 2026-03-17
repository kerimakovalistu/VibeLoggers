import { Link } from "react-router-dom";
import { Heart, Compass } from "lucide-react";

export default function Dashboard({ user }: { user: { name: string } }) {
  return (
    <div className="flex flex-col h-full">
      <header className="mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Hoş Geldin, {user.name.split(' ')[0]}!</h2>
        <p className="text-slate-500 dark:text-slate-400">Bugün kendini nasıl hissediyorsun?</p>
      </header>
      <div className="flex-1 flex flex-col lg:flex-row gap-8 items-stretch justify-center max-w-6xl mx-auto w-full mb-12">
        <Link
          to="/create"
          className="flex-1 group relative flex flex-col items-center justify-center gap-6 p-12 rounded-xl bg-[#FCE4EC] dark:bg-pink-900/20 border border-transparent hover:border-pink-200 dark:hover:border-pink-800 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <div className="size-24 rounded-full bg-white/80 dark:bg-slate-800 flex items-center justify-center text-pink-500 group-hover:scale-105 transition-transform duration-300">
            <Heart size={48} fill="currentColor" />
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-pink-700 dark:text-pink-400 tracking-wide uppercase">BİR ŞEY HİSSETTİM!</span>
            <p className="mt-2 text-pink-600/70 dark:text-pink-500/70 font-medium">Duygularını şimdi kaydet</p>
          </div>
        </Link>
        <Link
          to="/feed"
          className="flex-1 group relative flex flex-col items-center justify-center gap-6 p-12 rounded-xl bg-[#E8F5E9] dark:bg-green-900/20 border border-transparent hover:border-green-200 dark:hover:border-green-800 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <div className="size-24 rounded-full bg-white/80 dark:bg-slate-800 flex items-center justify-center text-green-500 group-hover:scale-105 transition-transform duration-300">
            <Compass size={48} fill="currentColor" />
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-green-700 dark:text-green-400 tracking-wide uppercase">NE HİSSETTİLER?</span>
            <p className="mt-2 text-green-600/70 dark:text-green-500/70 font-medium">Dünyadaki hisleri keşfet</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
