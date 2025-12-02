  "use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/lib/auth";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Bell, Eye } from "lucide-react";

  interface Project {
    id: number;
    title: string;
    description: string;
    budget: number;
    applications?: Array<{
      id: number;
      status: string;
    }>;
  }

  interface Application {
    id: number;
    status: string;
    project: {
      title: string;
      budget: number;
    };
  }

  export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    const token = getToken();

    useEffect(() => {
      if (!token) return;

      const loadData = async () => {
        try {
          // 1️⃣ dados do usuário
          const me = await api.get("/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUser(me.data);

          // CLIENTE → buscar projetos criados
          if (me.data.role === "CLIENT") {
            const response = await api.get(`/projects?creatorId=${me.data.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setProjects(response.data ?? []);
          }

          // FREELA → buscar candidaturas
          if (me.data.role === "FREELA") {
            const response = await api.get("/applications", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setApplications(response.data.data ?? []);
          }
        } catch (err) {
          console.log("Erro ao carregar Dashboard:", err);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, [token]);

    if (loading) return <div className="p-10">Carregando...</div>;

  const isClient = user?.role === "CLIENT";
  const isFrella = user?.role === "FREELA";

  // Função helper para contar aplicações pendentes
  const getPendingApplicationsCount = (project: Project) => {
    if (!project.applications) return 0;
    return project.applications.filter(app => app.status === "PENDING").length;
  };

    return (
      <div className="min-h-screen">
        <Sidebar />
        <Navbar />

        <main className="ml-0 md:ml-64 pt-20 p-6">
          <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

          {/* CLIENTE */}
          {isClient && (
            <section>
              <h2 className="text-xl font-medium mb-4">Seus Projetos</h2>

              {projects.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-lg">
                  Você ainda não criou nenhum projeto 😕  
                  <br />
                  <a
                    href="/dashboard/projetos/new"
                    className="text-blue-600 underline"
                  >
                    Criar projeto
                  </a>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.map((project) => {
                    const pendingCount = getPendingApplicationsCount(project);
                    const hasPendingApplications = pendingCount > 0;

                    return (
                      <div
                        key={project.id}
                        className="p-4 bg-white shadow rounded-xl border hover:shadow-lg transition h-full flex flex-col"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{project.title}</h3>
                          {hasPendingApplications && (
                            <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                              <Bell size={12} />
                              {pendingCount}
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-slate-500 mt-1 flex-grow">
                          {project.description ? project.description.substring(0, 100) + (project.description.length > 100 ? '...' : '') : 'Sem descrição disponível'}
                        </p>
                        <div className="mt-auto">
                          <p className="font-medium mb-3">
                            Orçamento: R$ {project.budget}
                          </p>

                          <div className="pt-3 border-t border-gray-200">
                            <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                              <Eye size={14} />
                              Ver detalhes
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* FREELA */}
          {isFrella && (
            <section>
              <h2 className="text-xl font-medium mb-4">Suas Candidaturas</h2>

              {applications.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-lg">
                  Você ainda não se candidatou a nenhum projeto 😕  
                  <br />
                  <a
                    href="/dashboard/projetos/disponiveis"
                    className="text-blue-600 underline"
                  >
                    Ver projetos disponíveis
                  </a>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 bg-white shadow rounded-xl border hover:shadow-lg transition h-full flex flex-col"
                    >
                      <div className="flex-grow">
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
                      </div>

                      <div className="mt-auto">
                        <p className="font-medium mb-3">
                          Orçamento: R$ {app.project.budget}
                        </p>

                        <div className="pt-3 border-t border-gray-200">
                          <Link href={`/dashboard/projetos/${app.project.id}`}>
                            <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                              <Eye size={14} />
                              Ver detalhes
                            </button>
                          </Link>
                        </div>
                      </div>
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
