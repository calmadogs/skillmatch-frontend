"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import api from "@/lib/api";
import { getToken } from "@/lib/auth";

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = getToken();

      await api.post(
        "/projects",
        {
          title,
          description,
          budget: Number(budget),
          deadline,
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      router.push("/dashboard");
    } catch (err: any) {
      console.error(
        "Erro ao criar projeto:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <Navbar />

      <main className="ml-0 md:ml-64 pt-24 px-6 pb-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">
            Criar Novo Projeto
          </h1>

          <form
            onSubmit={handleCreate}
            className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md"
          >
            {/* TÍTULO */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Título
              </label>
              <input
                type="text"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 focus:ring-2 focus:ring-slate-900/30 outline-none"
                placeholder="Ex: Desenvolvimento de site institucional"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* DESCRIÇÃO */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Descrição
              </label>
              <textarea
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 focus:ring-2 focus:ring-slate-900/30 outline-none"
                rows={5}
                placeholder="Descreva os detalhes do projeto..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* ORÇAMENTO */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Orçamento estimado
              </label>
              <input
                type="number"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 focus:ring-2 focus:ring-slate-900/30 outline-none"
                placeholder="Ex: 1500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </div>

            {/* DEADLINE */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Prazo (deadline)
              </label>
              <input
                type="date"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 focus:ring-2 focus:ring-slate-900/30 outline-none"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            {/* SKILLS */}
            <div className="mb-8">
              <label className="block mb-2 text-sm font-semibold text-slate-700">
                Skills (separe com vírgula)
              </label>
              <input
                type="text"
                className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-800 focus:ring-2 focus:ring-slate-900/30 outline-none"
                placeholder="Ex: react, node, ux, figma"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3 rounded-lg text-sm font-semibold hover:bg-slate-800 transition shadow"
            >
              {loading ? "Criando..." : "Criar Projeto"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
