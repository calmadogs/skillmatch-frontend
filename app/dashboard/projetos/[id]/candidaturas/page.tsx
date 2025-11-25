"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function CandidaturasPage() {
  const [apps, setApps] = useState([]);
  const token = getToken();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setApps(res.data.data);
      } catch (err) {
        console.error("Erro ao carregar candidaturas:", err);
      }
    };

    load();
  }, []);

  return (
    <div className="px-6 py-4">
      <h1 className="text-2xl font-bold mb-6">Minhas Candidaturas</h1>

      {apps.length === 0 && <p>Você ainda não se candidatou a nenhum projeto.</p>}

      <div className="space-y-4">
        {apps.map((app: any) => (
          <div key={app.id} className="border p-4 rounded-lg">
            <h2 className="font-semibold text-lg">{app.project.title}</h2>
            <p className="text-sm text-gray-700">Status: {app.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
