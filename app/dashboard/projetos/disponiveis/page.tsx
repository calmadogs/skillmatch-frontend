"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/lib/auth";
import Link from "next/link";
import { Briefcase, Calendar, DollarSign, User, Code } from "lucide-react";
import { skillIcons } from "@/lib/skill-icons";

export default function ProjetosDisponiveisPage() {
  const [projects, setProjects] = useState([]);
  const token = getToken();
 
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProjects(res.data);
      } catch (err) {
        console.error("Erro ao carregar projetos:", err);
      }
    };

    load();
  }, []);

  return (
    <div className="px-6 py-6">
      <h1 className="text-3xl font-semibold mb-6 text-slate-800">
        Projetos Disponíveis
      </h1>

      {projects.length === 0 && (
        <p className="text-slate-500">Nenhum projeto disponível no momento.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <Link
            key={project.id}
            href={`/dashboard/projetos/${project.id}`}
            className="p-5 border rounded-2xl bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                {project.title}
              </h2>

              <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-col gap-2 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-green-600" />
                  <span>Orçamento: R$ {project.budget}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-blue-600" />
                  <span>
                    Prazo:{" "}
                    {new Date(project.deadline).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User size={16} className="text-slate-700" />
                  <span>Cliente: {project.creator?.name}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {project.skills?.map((s: any) => {
                  const Icon = skillIcons[s.name.toLowerCase()] || Code;

                  return (
                    <span
                      key={s.id}
                      className="flex items-center gap-1 px-3 py-1 text-xs bg-slate-100 text-slate-700 rounded-full"
                    >
                      <Icon size={14} />
                      {s.name}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Rodapé */}
            <div className="mt-4 flex items-center justify-end gap-2 text-blue-600 font-medium">
              <Briefcase size={16} />
              Ver detalhes
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
