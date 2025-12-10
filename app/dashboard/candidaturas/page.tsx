// CÓDIGO COMPLETO COM MENSAGEM DO FILTRO QUANDO NÃO HÁ RESULTADOS
// Basta colar este arquivo em sua página Candidaturas

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useUser } from "@/lib/useUser";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Calendar, DollarSign, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Application {
  id: number;
  status: string;
  message?: string;
  description?: string;
  skills?: string[];
  deadlineAgreement?: boolean;
  createdAt: string;
  freelancer: {
    id: number;
    name: string;
    email: string;
  };
  project: {
    id: number;
    title: string;
    budget: number;
  };
}

interface ProjectWithApplications {
  id: number;
  title: number;
  budget: number;
  applications: Application[];
}

export default function CandidaturasPage() {
  const { user } = useUser();
  const [projectsWithApplications, setProjectsWithApplications] = useState<ProjectWithApplications[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    applicationId: number;
    newStatus: "APPROVED" | "REJECTED";
  } | null>(null);

  const token = getToken();

  useEffect(() => {
    const loadApplications = async () => {
      if (!user || !token) return;

      try {
        const response = await api.get("/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const applications: Application[] = response.data.data || [];
        const projectMap = new Map<number, ProjectWithApplications>();

        applications.forEach((app) => {
          if (!projectMap.has(app.project.id)) {
            projectMap.set(app.project.id, {
              id: app.project.id,
              title: app.project.title,
              budget: app.project.budget,
              applications: [],
            });
          }

          projectMap.get(app.project.id)!.applications.push(app);
        });

        setProjectsWithApplications(Array.from(projectMap.values()));
      } catch (error) {
        console.error("Erro ao carregar candidaturas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [user, token]);

  const openConfirmModal = (applicationId: number, newStatus: "APPROVED" | "REJECTED") => {
    setPendingAction({ applicationId, newStatus });
    setConfirmModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingAction || !token) return;

    const { applicationId, newStatus } = pendingAction;

    try {
      await api.put(
        `/applications/${applicationId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjectsWithApplications((prev) =>
        prev.map((project) => ({
          ...project,
          applications: project.applications.map((app) =>
            app.id === applicationId ? { ...app, status: newStatus } : app
          ),
        }))
      );

      if (selectedApplication?.id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setConfirmModalOpen(false);
      setPendingAction(null);
    }
  };

  const filterApplications = (apps: Application[]) => {
    if (filterStatus === "ALL") return apps;
    return apps.filter((app) => app.status === filterStatus);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Aprovada";
      case "REJECTED":
        return "Rejeitada";
      default:
        return "Pendente";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <Sidebar />
        <main className="ml-0 md:ml-64 pt-20 p-6">
          <div className="text-center py-10">Carregando candidaturas...</div>
        </main>
      </div>
    );
  }

  const noResultsMessage = {
    ALL: "Nenhum projeto possui candidaturas.",
    PENDING: "Nenhum projeto possui candidaturas pendentes.",
    APPROVED: "Nenhum projeto possui candidaturas aprovadas.",
    REJECTED: "Nenhum projeto possui candidaturas rejeitadas.",
  };

  const hasFilteredResults = projectsWithApplications.some((p) => filterApplications(p.applications).length > 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />

      <main className="ml-0 md:ml-64 pt-20 p-6">
        <div className="max-w-6xl mx-auto">
          {/* TOP BAR */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-600 transition">
                  <ArrowLeft size={18} />
                  <span className="text-sm font-medium">Voltar</span>
                </button>
              </Link>
              <h1 className="text-2xl font-semibold">Candidaturas Recebidas</h1>
            </div>

            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">Todos</option>
              <option value="PENDING">Pendentes</option>
              <option value="APPROVED">Aprovadas</option>
              <option value="REJECTED">Rejeitadas</option>
            </select>
          </div>

          {/* 🔵 MENSAGEM QUANDO NÃO HÁ PROJETOS DO FILTRO */}
          {!hasFilteredResults && (
            <div className="text-center py-10 text-slate-500">
              <MessageSquare size={48} className="mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium">{noResultsMessage[filterStatus]}</p>
            </div>
          )}

          {hasFilteredResults && (
            <div className="space-y-6">
              {projectsWithApplications.map((project) => {
                const filteredApps = filterApplications(project.applications);

                if (filteredApps.length === 0) return null;

                return (
                  <Card key={project.id} className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{project.title}</span>
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-green-600" />
                          <span className="text-green-600 font-semibold">R$ {project.budget}</span>
                        </div>
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        {filteredApps.map((application) => (
                          <div
                            key={application.id}
                            className="border rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User size={20} className="text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-800">
                                    {application.freelancer.name}
                                  </h4>
                                  <p className="text-sm text-slate-500">
                                    {application.freelancer.email}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(application.status)}>
                                  {getStatusText(application.status)}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedApplication(application);
                                    setDetailsModalOpen(true);
                                  }}
                                >
                                  Ver detalhes
                                </Button>
                              </div>
                            </div>

                            {application.description && (
                              <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                                {application.description}
                              </p>
                            )}

                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(application.createdAt).toLocaleDateString("pt-BR")}
                              </span>

                              {application.deadlineAgreement && (
                                <span className="text-green-600">✓ Concorda com prazo</span>
                              )}
                            </div>

                            {application.skills?.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {application.skills.map((skill, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                              <Button
                                variant="destructive"
                                onClick={() => openConfirmModal(application.id, "REJECTED")}
                              >
                                Recusar
                              </Button>

                              <Button
                                className="bg-green-600 text-white hover:bg-green-700"
                                onClick={() => openConfirmModal(application.id, "APPROVED")}
                              >
                                Aceitar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* MODAL CONFIRMAÇÃO */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Tem certeza?</DialogTitle>
            <DialogDescription>
              Essa ação irá alterar o status da candidatura. Deseja continuar?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setConfirmModalOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-blue-600 text-white" onClick={handleConfirmStatusChange}>
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DETALHES */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes da Candidatura</DialogTitle>
            <DialogDescription>
              Candidatura de {selectedApplication?.freelancer.name}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Freelancer</label>
                  <p className="font-semibold">{selectedApplication.freelancer.name}</p>
                  <p className="text-sm text-slate-500">{selectedApplication.freelancer.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">Status</label>
                  <Badge className={getStatusColor(selectedApplication.status)}>
                    {getStatusText(selectedApplication.status)}
                  </Badge>
                </div>
              </div>

              {selectedApplication.description && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Descrição da proposta</label>
                  <p className="text-sm bg-slate-50 p-3 rounded-lg mt-1">
                    {selectedApplication.description}
                  </p>
                </div>
              )}

              {selectedApplication.skills?.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Skills oferecidas</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedApplication.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}