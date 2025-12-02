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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
  title: string;
  budget: number;
  applications: Application[];
}

export default function CandidaturasPage() {
  const { user } = useUser();
  const [projectsWithApplications, setProjectsWithApplications] = useState<ProjectWithApplications[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const token = getToken();

  useEffect(() => {
    const loadApplications = async () => {
      if (!user || !token) return;

      try {
        // Buscar todas as aplicações dos projetos do cliente
        const response = await api.get("/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const applications: Application[] = response.data.data || [];

        // Agrupar aplicações por projeto
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

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setDetailsModalOpen(true);
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />

      <main className="ml-0 md:ml-64 pt-20 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header com botão voltar */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-600 transition">
                <ArrowLeft size={18} />
                <span className="text-sm font-medium">Voltar</span>
              </button>
            </Link>
            <h1 className="text-2xl font-semibold">Candidaturas Recebidas</h1>
          </div>

          {projectsWithApplications.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <MessageSquare size={48} className="mx-auto mb-4 text-slate-300" />
              <p className="text-lg">Nenhuma candidatura recebida ainda</p>
              <p className="text-sm">Seus projetos ainda não receberam aplicações de freelancers</p>
            </div>
          ) : (
            <div className="space-y-6">
              {projectsWithApplications.map((project) => (
                <Card key={project.id} className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{project.title}</span>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-green-600" />
                        <span className="text-green-600 font-semibold">
                          R$ {project.budget}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="mb-4">
                      <span className="text-sm font-medium text-slate-600">
                        {project.applications.length} candidatura{project.applications.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {project.applications.map((application) => (
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
                                onClick={() => handleViewDetails(application)}
                              >
                                Ver detalhes
                              </Button>
                            </div>
                          </div>

                          {application.description && (
                            <div className="mb-2">
                              <p className="text-sm text-slate-600 line-clamp-2">
                                {application.description}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(application.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                            {application.deadlineAgreement && (
                              <span className="text-green-600">✓ Concorda com prazo</span>
                            )}
                          </div>

                          {application.skills && application.skills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {application.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de detalhes da candidatura */}
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

              <div>
                <label className="text-sm font-medium text-slate-600">Projeto</label>
                <p className="font-semibold">{selectedApplication.project.title}</p>
              </div>

              {selectedApplication.description && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Descrição da proposta</label>
                  <p className="text-sm bg-slate-50 p-3 rounded-lg mt-1">
                    {selectedApplication.description}
                  </p>
                </div>
              )}

              {selectedApplication.skills && selectedApplication.skills.length > 0 && (
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Data da candidatura</label>
                  <p className="text-sm">
                    {new Date(selectedApplication.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">Concorda com prazo</label>
                  <p className="text-sm">
                    {selectedApplication.deadlineAgreement ? (
                      <span className="text-green-600">✓ Sim</span>
                    ) : (
                      <span className="text-slate-500">✗ Não</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
