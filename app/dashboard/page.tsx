"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/lib/auth";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Eye, Trash2 } from "lucide-react";

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
    id: number;
    title: string;
    description?: string;
    budget: number;
  };
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const token = getToken();

  // Abrir modal de confirmação
  const openDeleteModal = (appId: number) => {
    setConfirmDeleteId(appId);
  };

  // Fechar modal
  const closeDeleteModal = () => {
    setConfirmDeleteId(null);
  };

  // EXCLUIR CANDIDATURA
  const deleteApplication = async () => {
    if (!confirmDeleteId) return;

    try {
      await api.delete(`/applications/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications((prev) => prev.filter((a) => a.id !== confirmDeleteId));
      closeDeleteModal();
    } catch (err) {
      console.error("Erro ao excluir candidatura:", err);
      alert("Erro ao excluir candidatura.");
    }
  };

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const me = await api.get("/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(me.data);

        if (me.data.role === "CLIENT") {
          const resp = await api.get(`/projects?creatorId=${me.data.id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProjects(resp.data ?? []);
        }

        if (me.data.role === "FREELA") {
          const resp = await api.get("/applications", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setApplications(resp.data.data ?? []);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
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

        {/* ================= CLIENTE ================= */}
        {isClient && (
          <section>
            <h2 className="text-xl font-medium mb-4">Seus Projetos</h2>

            {projects.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-lg">
                Você ainda não criou nenhum projeto 😕<br />
                <a href="/dashboard/projetos/new" className="text-blue-600 underline">
                  Criar projeto
                </a>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 bg-white shadow rounded-xl border hover:shadow-lg transition h-full flex flex-col"
                  >
                    <h3 className="font-semibold text-lg">{project.title}</h3>

                    <p className="text-sm text-slate-500 mt-1 flex-grow">
                      {project.description?.substring(0, 100)}
                      {project.description?.length > 100 ? "..." : ""}
                    </p>

                    <div className="mt-auto">
                      <p className="font-medium mb-3">Orçamento: R$ {project.budget}</p>

                      <div className="pt-3 border-t">
                        <Link href={`/dashboard/projetos/${project.id}/candidaturas`}>
                          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium">
                            <Eye size={14} /> Ver detalhes
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

        {/* ================= FREELA ================= */}
        {isFrella && (
          <section>
            <h2 className="text-xl font-medium mb-4">Suas Candidaturas</h2>

            {applications.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-lg">
                Você ainda não se candidatou 😕<br />
                <a href="/dashboard/projetos/disponiveis" className="text-blue-600 underline">
                  Ver projetos disponíveis
                </a>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="relative p-4 bg-white shadow rounded-xl border hover:shadow-lg transition h-full flex flex-col"
                  >
                    <h3 className="font-semibold text-lg">{app.project.title}</h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Status:{" "}
                      <span
                        className={`font-semibold ${app.status === "APPROVED"
                            ? "text-green-600"
                            : app.status === "REJECTED"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                      >
                        {app.status}
                      </span>
                    </p>

                    <div className="mt-auto flex justify-end pt-3 border-t">
                      {/* Lixeira embaixo à direita */}
                      <button
                        onClick={() => openDeleteModal(app.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* ================= MODAL CONFIRMAÇÃO ================= */}
      <Dialog open={confirmDeleteId !== null} onOpenChange={closeDeleteModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Tem certeza?</DialogTitle>
            <DialogDescription>
              Essa ação vai excluir sua candidatura permanentemente.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeDeleteModal}>Cancelar</Button>
            <Button variant="destructive" onClick={deleteApplication}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
