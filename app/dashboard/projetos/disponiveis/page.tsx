"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/lib/auth";
import Link from "next/link";

export default function ProjetosDisponiveisPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("TOKEN FRONT:", getToken());

    const load = async () => {
      try {
        const token = getToken(); // <-- AGORA funciona corretamente no client

        if (!token) {
          console.error("Token não encontrado");
          return;
        }

        const res = await api.get("/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProjects(res.data ?? []);
      } catch (err) {
        console.error("Erro ao carregar projetos:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="p-10">Carregando...</div>;

  return (
    <div className="px-6 py-4">
      <h1 className="text-2xl font-bold mb-6">Projetos Disponíveis</h1>

      {projects.length === 0 && <p>Nenhum projeto disponível no momento.</p>}

      <div className="space-y-4">
        {projects.map((project: any) => (
          <Link
            key={project.id}
            href={`/dashboard/projetos/${project.id}`}
            className="block border p-4 rounded-lg hover:bg-gray-50 transition"
          >
            <h2 className="font-semibold text-lg">{project.title}</h2>
            <p className="text-sm text-gray-700">{project.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
