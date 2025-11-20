  "use client";

  import { useEffect, useState } from "react";
  import api from "@/lib/api";
  import { getToken } from "@/lib/auth";

  import Navbar from "@/components/layout/Navbar";
  import Sidebar from "@/components/layout/Sidebar";

  interface Project {
    id: number;
    title: string;
    description: string;
    budget: number;
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
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 bg-white shadow rounded-xl border hover:shadow-lg transition"
                    >
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {project.description.substring(0, 100)}...
                      </p>
                      <p className="mt-2 font-medium">
                        Orçamento: R$ {project.budget}
                      </p>
                    </div>
                  ))}
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
