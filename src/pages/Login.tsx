import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Waves } from "lucide-react";

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const body = isRegister ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("vibeloggers_user", JSON.stringify(data));
        onLogin(data);
        navigate("/");
      } else {
        setError(data.error || "Bir hata oluştu.");
      }
    } catch (err) {
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f6f8f6] p-4 relative">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="size-16 rounded-full bg-[#13ec5b] flex items-center justify-center text-white mb-4">
            <Waves size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            {isRegister ? "VibeLoggers'a Katıl" : "Tekrar Hoş Geldin"}
          </h2>
          <p className="text-slate-500 mt-2 text-center">
            {isRegister
              ? "Duygularını dünyayla paylaşmaya başla."
              : "Duygularını günlüğe kaydetmeye devam et."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Ad Soyad</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#13ec5b]/50 transition-all"
                placeholder="Örn: Emre Can"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              {isRegister ? "E-posta" : "E-posta veya Kullanıcı Adı"}
            </label>
            <input
              type={isRegister ? "email" : "text"}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#13ec5b]/50 transition-all"
              placeholder={isRegister ? "ornek@email.com" : "E-posta veya kullanıcı adı"}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Şifre</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-[#13ec5b]/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#13ec5b] hover:bg-[#10d451] text-white font-bold rounded-xl transition-all active:scale-95 shadow-md shadow-green-100 disabled:opacity-50 mt-6"
          >
            {loading ? "Bekleniyor..." : isRegister ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            {isRegister ? "Zaten hesabın var mı?" : "Henüz hesabın yok mu?"}{" "}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
              }}
              className="text-[#13ec5b] font-bold hover:underline"
            >
              {isRegister ? "Giriş Yap" : "Kayıt Ol"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
