"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, DollarSign, CalendarDays } from "lucide-react";
import ApplyModal from "@/components/modals/apply-modal";
import { getToken } from "@/lib/auth";

export default function ProjectDetailsPage() {
    const params = useParams();
    const id = params.id;

    const [project, setProject] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [applyOpen, setApplyOpen] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchProject = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const token = getToken(); // garante token atualizado
                const res = await api.get(`/projects/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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


    if (isLoading) {
        return <div className="p-10 text-center text-gray-600">Carregando projeto...</div>;
    }

    if (error) {
        return <div className="p-10 text-center text-red-500">{error}</div>;
    }

    if (!project) {
        return <div className="p-10 text-center text-gray-600">Projeto não encontrado.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">{project.title}</h1>

            <Card className="shadow-md border rounded-2xl mb-8">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2 text-gray-700">
                        <MapPin size={20} />
                        <span>{project.name || "Não informado"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                        <DollarSign size={20} />
                        <span>{project.budget || "A combinar"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                        <CalendarDays size={20} />
                        <span>Prazo: {project.deadline ? new Date(project.deadline).toLocaleDateString("pt-BR") : "Não informado"}</span>
                    </div>

                    <p className="text-gray-600 leading-relaxed">{project.description}</p>

                    <div>
                        <h3 className="font-semibold mb-2">Habilidades necessárias:</h3>

                        <div className="flex flex-wrap gap-2">
                            {project.skills?.map((skill: any) => (
                                <span
                                    key={skill.id || skill.name}
                                    className="bg-gray-100 px-3 py-1 text-sm rounded-full border"
                                >
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <Button className="mt-4" onClick={() => setApplyOpen(true)}>
                        Candidatar-se
                    </Button>
                </CardContent>
            </Card>

            <ApplyModal
                open={applyOpen}
                onClose={() => setApplyOpen(false)}
                projectName={project.title}
                projectSkills={project.skills?.map((s: any) => s.name) || []}
                onSubmit={async (formData) => {
                    setApplyOpen(false);
                    try {
                        await api.post("/applications", {
                            projectId: project.id,
                            ...formData,
                        });
                        alert("Candidatura enviada com sucesso!");
                        setApplyOpen(false);
                    } catch (error) {
                        console.error("Erro ao enviar candidatura:", error);
                        alert("Erro ao enviar candidatura. Tente novamente.");
                    }
                }}

            />
        </div>
    );
}
