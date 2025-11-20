"use client";

import Link from "next/link";
import { Home, Briefcase, User, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth";
import {jwtDecode} from "jwt-decode";

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

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Home },

    ...(role === "CLIENT"
      ? [{ href: "/dashboard/projects/new", label: "Criar projetos", icon: Briefcase }]
      : []),

    ...(role === "ADMIN"
      ? [{ href: "/dashboard/users", label: "Gerenciar usuários", icon: Users }]
      : []),

    { href: "/dashboard/profile", label: "Perfil", icon: User },
  ];

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
