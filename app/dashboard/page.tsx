import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";


export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
          <p className="text-slate-600">Aqui você verá suas atividades, projetos e status.</p>
        </main>
      </div>
    </div>
  );
}
