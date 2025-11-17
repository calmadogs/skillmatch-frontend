import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <Navbar />
      <main className="ml-0 md:ml-64 pt-20 p-6">
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <p className="text-slate-600">Aqui você verá suas atividades, projetos e status.</p>
      </main>
    </div>
  );
}
