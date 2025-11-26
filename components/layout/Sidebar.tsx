"use client";

import Link from "next/link";
import { Home, Briefcase, User, Users, Settings, ListChecks } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number;
  role: "CLIENT" | "FREELA" | "ADMIN";
}

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<DecodedToken["role"] | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      setRole(decoded.role);
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
    }
  }, []);

  // Menus específicos por tipo de usuário
  const clientLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/projetos/novoProjeto", label: "Criar projetos", icon: Briefcase },
    { href: "/dashboard/projetos/andamento", label: "Projetos em andamento", icon: ListChecks },
    { href: "/dashboard/profile", label: "Perfil", icon: User },
    { href: "/logout", label: "Sair", icon: User },
  ];

    const freelaLinks = [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      { href: "/dashboard/projetos/disponiveis", label: "Projetos disponíveis", icon: Briefcase },
      { href: "/dashboard/trabalhos/andamento", label: "Trabalhos em andamento", icon: ListChecks },
      { href: "/dashboard/profile", label: "Perfil", icon: User },
      { href: "/logout", label: "Sair", icon: User },
    ];

  const adminLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/users", label: "Gerenciar usuários", icon: Users },
    { href: "/dashboard/projetos", label: "Gerenciar projetos", icon: Briefcase },
    { href: "/dashboard/settings", label: "Configurações", icon: Settings },
    { href: "/dashboard/profile", label: "Perfil", icon: User },
    { href: "/logout", label: "Sair", icon: User },
  ];

  const links =
    role === "CLIENT"
      ? clientLinks
      : role === "FRELA" || role === "FREELA"
      ? freelaLinks
      : role === "ADMIN"
      ? adminLinks
      : [];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 p-4 pt-20">
      <nav className="flex flex-col gap-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
              pathname === href
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
