import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">

      {/* NAVBAR */}
       <Navbar />
       
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center mt-32 px-6">
        <h2 className="text-4xl md:text-5xl font-bold max-w-3xl">
          Conecte <span className="text-blue-600">Clientes</span> e{" "}
          <span className="text-blue-600">Freelancers</span> de forma simples e eficiente
        </h2>

        <p className="mt-4 text-lg text-gray-600 max-w-2xl">
          Encontre profissionais qualificados ou oportunidades reais para sua carreira.
        </p>

        <Button size="lg" className="mt-6 flex items-center gap-2">
          Começar agora
          <ArrowRight size={18} />
        </Button>
      </section>

      {/* BENEFÍCIOS */}
      <section className="mt-32 max-w-6xl mx-auto px-6">
        <h3 className="text-3xl font-semibold text-center mb-12">Por que usar a SkillMatch?</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-xl shadow-sm">
            <h4 className="text-xl font-semibold mb-2">Sistema Inteligente</h4>
            <p className="text-gray-600">Conectamos clientes aos melhores freelancers do mercado.</p>
          </div>

          <div className="p-6 border rounded-xl shadow-sm">
            <h4 className="text-xl font-semibold mb-2">Transparência</h4>
            <p className="text-gray-600">Processo claro, seguro e confiável.</p>
          </div>

          <div className="p-6 border rounded-xl shadow-sm">
            <h4 className="text-xl font-semibold mb-2">Velocidade</h4>
            <p className="text-gray-600">Gerenciamento direto e rápido entre as partes.</p>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mt-32 bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-semibold text-center mb-12">Como funciona</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1</div>
              <p className="text-gray-700">Crie sua conta como cliente ou freelancer.</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
              <p className="text-gray-700">Publique projetos ou encontre oportunidades.</p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
              <p className="text-gray-700">Gerencie tudo dentro do dashboard seguro.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-32 text-center mb-32 px-6">
        <h3 className="text-3xl font-semibold">Pronto para começar?</h3>
        <p className="text-gray-600 mt-2">Crie uma conta em poucos segundos.</p>

        <Button size="lg" className="mt-6">
          Criar minha conta
        </Button>
      </section>

      {/* FOOTER */}
      <footer className="w-full border-t py-6 text-center text-gray-600">
        © {new Date().getFullYear()} SkillMatch — Todos os direitos reservados.
      </footer>

    </div>
  );
}
