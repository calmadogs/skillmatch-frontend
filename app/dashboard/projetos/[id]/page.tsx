"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, CalendarDays, ChevronLeft, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import ApplyModal from "@/components/modals/apply-modal";
import { getToken } from "@/lib/auth";
import { useUser } from "@/lib/useUser";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default function ProjectDetailsPage() {
    const params = useParams();
    const id = params.id;
    const { user } = useUser();

    const [project, setProject] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [applyOpen, setApplyOpen] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchProject = async () => {
            try {
                const token = getToken();
                const res = await api.get(`/projects/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProject(res.data);
            } catch (err) {
                console.error("Erro ao carregar projeto:", err);
                setError("Erro ao carregar o projeto.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    // Verificar se o usuário já se candidatou (separado para executar quando user estiver disponível)
    useEffect(() => {
        if (!id || !project || !user || !user.userId) return;

        const checkApplication = async () => {
            try {
                const token = getToken();
                const applicationsRes = await api.get(`/applications?freelancerId=${user.userId}&projectId=${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const applications = applicationsRes.data.data || [];
                const hasAppliedCheck = applications.some((app: any) => app.projectId === Number(id));
                setHasApplied(hasAppliedCheck);
            } catch (err: any) {
                console.error("Erro ao verificar candidaturas:", err);
                setHasApplied(false);
            }
        };

        checkApplication();
    }, [id, user, project]);

    const handleCancelApplication = async () => {
        try {
            const token = getToken();
            // Primeiro buscar a aplicação do usuário para este projeto
            const applicationsRes = await api.get(`/applications?freelancerId=${user?.userId}&projectId=${project.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const applications = applicationsRes.data.data || [];

            if (applications.length === 0) {
                setSuccessMessage("Candidatura não encontrada.");
                setSuccessModalOpen(true);
                return;
            }

            const applicationId = applications[0].id;
            await api.delete(`/applications/${applicationId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setConfirmCancelOpen(false);
            setSuccessMessage("Candidatura cancelada com sucesso!");
            setSuccessModalOpen(true);

            // Recarregar a página após 2 segundos
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error("Erro ao cancelar candidatura:", error);
            setConfirmCancelOpen(false);
            setSuccessMessage("Erro ao cancelar candidatura.");
            setSuccessModalOpen(true);
        }
    };

    if (isLoading) return <div className="p-10 text-center">Carregando...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
    if (!project) return <div className="p-10 text-center">Projeto não encontrado.</div>;

    return (
        <div className="min-h-screen">
            <Navbar />
            <Sidebar />

            <div className="ml-0 md:ml-64 pt-12 p-6" >
                <div className="max-w-4xl mx-auto py-10 px-4">

                    {/* TÍTULO CENTRALIZADO */}
                    <h1 className="text-3xl font-bold text-center mb-6">
                        {project.title}
                    </h1>

                    <Card className="relative shadow-md border rounded-2xl mb-8">

                        {/* SETA PARA VOLTAR */}
                        <Link href="/dashboard/projetos/disponiveis">
                            <button className="absolute left-4 top-4 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-600 transition">
                                <ChevronLeft size={18} />
                                <span className="text-sm font-medium">Voltar</span>
                            </button>
                        </Link>

                        <CardContent className="p-6 space-y-5">

                            {/* CLIENTE */}
                            <div className="flex items-center gap-2 text-gray-700">
                                <User size={20} className="text-gray-600" />
                                <span className="font-medium">
                                    Cliente: {project.creator?.name || "Não informado"}
                                </span>
                            </div>

                            {/* VALOR */}
                            <div className="flex items-center gap-2 text-gray-700">
                                <DollarSign size={20} />
                                <span className="font-medium">
                                    Valor: {project.budget || "A combinar"}
                                </span>
                            </div>

                            {/* PRAZO */}
                            <div className="flex items-center gap-2 text-gray-700">
                                <CalendarDays size={20} />
                                <span>
                                    Prazo:{" "}
                                    {project.deadline
                                        ? new Date(project.deadline).toLocaleDateString("pt-BR")
                                        : "Não informado"}
                                </span>
                            </div>

                            {/* DESCRIÇÃO */}
                            <p className="text-gray-600 leading-relaxed">
                                {project.description}
                            </p>

                            {/* SKILLS */}
                            <div>
                                <h3 className="font-semibold mb-2">Habilidades necessárias:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.skills?.map((skill: any) => (
                                        <span
                                            key={skill.id || skill.name}
                                            className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full"
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* BOTÃO */}
                            {hasApplied ? (
                                <div className="mt-4 space-y-3">
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                                        <p className="text-green-700 font-medium">
                                            ✓ Você já se candidatou para este projeto
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 text-lg font-medium rounded-xl transition"
                                            onClick={() => setConfirmCancelOpen(true)}
                                        >
                                            Cancelar candidatura
                                        </Button>
                                        <Button
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-medium rounded-xl transition"
                                            onClick={() => window.history.back()}
                                        >
                                            Voltar
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-medium rounded-xl transition"
                                    onClick={() => setApplyOpen(true)}
                                >
                                    Candidatar-se
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    <ApplyModal
                        open={applyOpen}
                        onClose={() => setApplyOpen(false)}
                        projectName={project.title}
                        projectSkills={project.skills?.map((s: any) => s.name) || []}
                        hasApplied={hasApplied}
                        onSubmit={async (formData) => {
                            try {
                                const token = getToken();

                                if (!user) {
                                    setSuccessMessage("Erro: usuário não autenticado");
                                    setSuccessModalOpen(true);
                                    return;
                                }

                                await api.post("/applications", {
                                    freelancerId: user.userId,
                                    projectId: project.id,
                                    ...formData,
                                }, {
                                    headers: { Authorization: `Bearer ${token}` },
                                });
                                setApplyOpen(false);
                                setSuccessMessage("Candidatura enviada com sucesso!");
                                setSuccessModalOpen(true);
                            } catch (error) {
                                console.error("Erro ao enviar candidatura:", error);
                                setSuccessMessage("Erro ao enviar candidatura.");
                                setSuccessModalOpen(true);
                            }
                        }}

                    />

                    {/* Modal de confirmação de cancelamento */}
                    <Dialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Confirmar cancelamento</DialogTitle>
                                <DialogDescription>
                                    Tem certeza que deseja cancelar sua candidatura para este projeto?
                                    Esta ação não pode ser desfeita.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setConfirmCancelOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleCancelApplication}
                                >
                                    Confirmar cancelamento
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Modal de sucesso/erro */}
                    <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    {successMessage.includes("sucesso") ? "Sucesso!" : "Atenção"}
                                </DialogTitle>
                                <DialogDescription>
                                    {successMessage}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button onClick={() => setSuccessModalOpen(false)}>
                                    Fechar
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
