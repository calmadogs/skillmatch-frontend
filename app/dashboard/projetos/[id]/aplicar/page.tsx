"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import api from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AplicarPage() {
  const { id } = useParams();
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = getToken();

  const handleApply = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post(
        "/applications",
        {
          projectId: Number(id),
          message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      router.push("/dashboard");
    } catch (err) {
      console.log("Erro:", err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />

      <main className="ml-0 md:ml-64 pt-24 p-6 max-w-xl mx-auto">
        <Card className="p-6 rounded-2xl shadow-sm border bg-white">
          <h1 className="text-2xl font-semibold mb-4">
            Aplicar para o Projeto #{id}
          </h1>

          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Mensagem (opcional)
              </label>
              <textarea
                className="w-full border rounded-lg p-3 h-32 text-sm outline-none"
                placeholder="Por que você é ideal para este projeto?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Enviar candidatura"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
