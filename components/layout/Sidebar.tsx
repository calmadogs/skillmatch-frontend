"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import api from "@/lib/api";

export default function Sidebar() {
  const [user, setUser] = useState<any>(null);
  const token = getToken();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.log("Erro ao carregar usuário:", err);
      }
    };

    if (token) loadUser();
  }, [token]);

  return (
    <aside className="hidden md:block w-64 bg-white border-r h-screen fixed left-0 top-0 p-6">
      <h2 className="text-xl font-semibold mb-8">Dashboard</h2>

      {!user ? (
        <p>Carregando...</p>
      ) : (
        <nav className="flex flex-col gap-3">

          {/* CLIENTE */}
          {user.role === "CLIENT" && (
            <>
              <Link href="/dashboard/projetos/new" className="sidebar-link">
                Criar Projeto
              </Link>

              <Link href="/dashboard" className="sidebar-link">
                Seus Projetos
              </Link>
            </>
          )}

          {/* FREELA */}
          {user.role === "FREELA" && (
            <>
              {/* CORRIGIDO → estava "disponiveis" */}
              <Link href="/dashboard/projetos/disponiveis" className="sidebar-link">
                Projetos Disponíveis
              </Link>

              {/* CORRIGIDO → você não tem essa rota "/projetos/candidaturas" */}
              <Link href="/dashboard/candidaturas" className="sidebar-link">
                Minhas Candidaturas
              </Link>
            </>
          )}

          {/* ADMIN */}
          {user.role === "ADMIN" && (
            <>
              <Link href="/dashboard/admin/users" className="sidebar-link">
                Gerenciar Usuários
              </Link>
            </>
          )}
        </nav>
      )}
    </aside>
  );
}
