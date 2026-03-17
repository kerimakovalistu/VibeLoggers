import { Bell, Shield, Moon, LogOut } from "lucide-react";

export default function Settings({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="max-w-3xl mx-auto w-full py-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Ayarlar</h2>
        <p className="text-slate-500 mt-2">Hesap ve uygulama tercihlerini yönet.</p>
      </header>

      <div className="space-y-6">
        {/* Bildirimler */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Bell size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Bildirimler</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Yeni Beğeniler</p>
                <p className="text-sm text-slate-500">Viblogların beğenildiğinde haber ver.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13ec5b]"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Haftalık Özet</p>
                <p className="text-sm text-slate-500">Haftalık duygu durumu raporunu al.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13ec5b]"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Görünüm */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Moon size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Görünüm</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">Karanlık Mod</p>
                <p className="text-sm text-slate-500">Göz yormayan karanlık tema.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer opacity-50" title="MVP'de henüz aktif değil">
                <input type="checkbox" className="sr-only peer" disabled />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13ec5b]"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Güvenlik & Çıkış */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Shield size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Hesap</h3>
          </div>
          <div className="p-6">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-4 py-3 rounded-xl transition-colors w-full md:w-auto"
            >
              <LogOut size={20} />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
