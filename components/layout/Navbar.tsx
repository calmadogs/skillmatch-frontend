"use client";

import { useEffect, useState } from "react";
import { getToken, logout } from "@/lib/auth";
import api from "@/lib/api";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await api.get("/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-50">
      <h1 className="text-xl font-bold text-slate-800">SkillMatch</h1>

      <div className="flex items-center gap-4">
        {loading ? (
          <p className="text-sm text-slate-500">Carregando...</p>
        ) : (
          <p className="text-sm font-medium text-slate-700">{user?.name}</p>
        )}

        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 text-sm">
          <span>U</span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition shadow-sm"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </header>
  );
}
