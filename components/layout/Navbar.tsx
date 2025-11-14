"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Início" },
    { href: "/sobre", label: "Sobre" },
    { href: "/projetos", label: "Projetos" },
    { href: "/freelancers", label: "Freelancers" },
  ];

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur-sm fixed top-0 z-50">
      <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
        
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold">
          SkillMatch
        </Link>

        {/* LINKS */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm transition ${
                pathname === item.href
                  ? "text-blue-600 font-semibold"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* AÇÕES */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>

          <Button asChild>
            <Link href="/register">Registrar</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
  