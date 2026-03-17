import { Link, useLocation } from "react-router-dom";
import { Home, User as UserIcon, Rss, Settings, Waves, ShieldAlert } from "lucide-react";

export default function Sidebar({ user }: { user: { name: string; isAdmin?: boolean } }) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Ana Sayfa", icon: Home },
    { path: "/profile", label: "Profilim", icon: UserIcon },
    { path: "/feed", label: "Akış", icon: Rss },
    { path: "/settings", label: "Ayarlar", icon: Settings },
  ];

  if (user.isAdmin) {
    navItems.push({ path: "/admin", label: "Sistem Yönetimi", icon: ShieldAlert });
  }

  return (
    <aside className="w-72 bg-[#f0f2f0] border-r border-slate-200 flex flex-col fixed h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="size-10 rounded-full bg-[#13ec5b] flex items-center justify-center text-white">
            <Waves size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">VibeLoggers</h1>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-white/50 text-slate-600"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-6">
        <div className="flex items-center gap-3 p-3 bg-white/40 rounded-xl border border-slate-200/50">
          <div className="size-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
            <UserIcon size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500">{user.isAdmin ? "Master Admin" : "Premium Üye"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
