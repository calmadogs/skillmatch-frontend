"use client";

import { useEffect, useState } from "react";
import { getToken, logout } from "@/lib/auth";
import api from "@/lib/api";
import { LogOut } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await api.get("/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
      setUser(null);
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
        ) : user ? (
          // ✅ USUÁRIO LOGADO
          <>
            <p className="text-sm font-medium text-slate-700">
              {user.name} 
            </p>

            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition shadow-sm"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Sair</span>
            </button>
          </>
        ) : (
          // ❌ NÃO LOGADO
          <>
            <Link href="/login">
              <button className="text-sm font-medium text-slate-700 hover:text-blue-600">
                Login
              </button>
            </Link>

            <Link href="/register">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Registrar
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}