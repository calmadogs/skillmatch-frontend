"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function ProjetoDetalhePage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const token = getToken();

  useEffect(() => {
    const load = async () => {
      try {
        // Buscar todos os projetos
        const res = await api.get("/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Achar o projeto pelo ID
        const item = res.data.find((p: any) => p.id == id);

        setProject(item);
      } catch (err) {
        console.error("Erro ao carregar projeto:", err);
      }
    };

    if (id) load();
  }, [id]);

  if (!project) return <p className="p-6">Carregando...</p>;

  return (
    <div className="px-6 py-4">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-700">{project.description}</p>

      <div className="mt-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Candidatar-se
        </button>
      </div>
    </div>
  );
}
