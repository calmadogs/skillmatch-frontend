"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/lib/auth";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token = getToken();

  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      try {
        const me = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(me.data);

        if (me.data.role === "CLIENT") {
          const res = await api.get(`/projects?creatorId=${me.data.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setProjects(res.data ?? []);
        }

        if (me.data.role === "FREELA") {
          const res = await api.get("/applications", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setApplications(res.data.data ?? []);
        }
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  if (loading) return <div className="p-10">Carregando...</div>;

  const isClient = user?.role === "CLIENT";
  const isFreella = user?.role === "FREELA";

  return (
    <div className="min-h-screen">
      <Sidebar />
      <Navbar />

      <main className="ml-0 md:ml-64 pt-20 p-6">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {/* --- BOTÕES DO TOPO --- */}
        <div className="flex gap-4 mb-6">

          {isClient && (
            <a
              href="/dashboard/projetos/new"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
            >
              Criar novo projeto
            </a>
          )}

          {isFreella && (
            <a
              href="/dashboard/projetos/disponiveis"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm"
            >
              Ver projetos disponíveis
            </a>
          )}
        </div>

        {/* CLIENTE */}
        {isClient && (
          <section>
            <h2 className="text-xl font-medium mb-4">Seus Projetos</h2>

            {projects.length === 0 ? (
              <p className="text-slate-500 text-lg">Você ainda não criou nenhum projeto.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <a
                    key={project.id}
                    href={`/dashboard/projetos/${project.id}`}
                    className="p-4 bg-white shadow rounded-xl border hover:shadow-lg transition block"
                  >
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    <p className="text-sm text-slate-500 mt-2">
                      {project.description.substring(0, 110)}...
                    </p>

                    <p className="mt-3 font-medium text-green-600">
                      R$ {project.budget}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </section>
        )}

        {/* FREELLA */}
        {isFreella && (
          <section>
            <h2 className="text-xl font-medium mb-4">Suas Candidaturas</h2>

            {applications.length === 0 ? (
              <p className="text-slate-500">
                Você ainda não se candidatou a nenhum projeto.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 bg-white shadow rounded-xl border hover:shadow-lg transition"
                  >
                    <h3 className="font-semibold text-lg">
                      {app.project.title}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          app.status === "APPROVED"
                            ? "text-green-600"
                            : app.status === "REJECTED"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {app.status}
                      </span>
                    </p>

                    <p className="mt-2 font-medium">
                      Orçamento: R$ {app.project.budget}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
