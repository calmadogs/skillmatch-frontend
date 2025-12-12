"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

interface Application {
  id: number;
  status: string;
  user: {
    id: number;
    name: string;
    email?: string;
  };
}

export default function CandidaturasDoProjetoPage() {
  const { id } = useParams(); // ID DO PROJETO
  const token = getToken();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const load = async () => {
      try {
        const resp = await api.get(`/applications?projectId=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setApplications(resp.data.data ?? []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, id]);

  if (loading) return <div className="p-10">Carregando...</div>;

  return (
    <div className="min-h-screen">
      <Sidebar />
      <Navbar />

      <main className="ml-0 md:ml-64 pt-20 p-6">
        <h1 className="text-2xl font-semibold mb-6">
          Candidaturas do Projeto #{id}
        </h1>

        {applications.length === 0 ? (
          <div className="text-slate-500 text-lg">
            Nenhuma candidatura para este projeto 😕
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-4 bg-white shadow rounded-xl border hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-lg">
                  Freela: {app.user?.name}
                </h3>

                <p className="text-sm text-slate-500 mt-2">
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
