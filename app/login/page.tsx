"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoginError("");

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || "Credenciais inválidas");
        return;
      }

      // Salvar token no localStorage (por enquanto, até fazermos autenticação completa)
      document.cookie = `token=${data.token}; path=/;`;

      window.location.href = "/dashboard"; // ajuste depois para sua página inicial
    } catch (error) {
      console.error(error);
      setLoginError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-300">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-semibold text-center mb-6">Entrar</h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
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

            {loginError && (
              <p className="text-red-600 text-sm text-center">{loginError}</p>
            )}

            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="text-center text-sm mt-4">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Criar conta
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
