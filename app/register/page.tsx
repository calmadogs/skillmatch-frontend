"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    if (!form.role) {
      alert("Selecione se você é Cliente ou Freelancer.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await response.json();
      console.log("REGISTER RESPONSE:", data);

      if (!response.ok) {
        alert(data.message || "Erro ao registrar");
        return;
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MODAL DE SUCESSO */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
            <h2 className="text-xl font-semibold mb-3">Conta criada!</h2>
            <p className="text-gray-600 mb-5">
              Seu registro foi realizado com sucesso.
            </p>

            <div className="flex flex-col gap-3">
              <Button
                className="w-full"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Ir para o Login
              </Button>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="text-gray-500 hover:underline text-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAGE NORMAL */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <Card className="w-full max-w-md shadow-lg border border-gray-300">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-semibold text-center mb-6">
              Criar Conta
            </h1>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium">Nome Completo</label>
                <Input
                  name="name"
                  placeholder="Seu nome"
                  required
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="seuemail@email.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Senha</label>
                <Input
                  name="password"
                  type="password"
                  placeholder="********"
                  required
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Confirmar Senha</label>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="********"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Você é:</label>
                <select
                  name="role"
                  required
                  value={form.role}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md bg-white"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="CLIENT">Cliente</option>
                  <option value="FREELANCER">Freelancer</option>
                </select>
              </div>

              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>

            <p className="text-center text-sm mt-4">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
