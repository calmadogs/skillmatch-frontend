import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

export const metadata: Metadata = {
  title: "SkillMatch",
  description: "Conectando clientes e freelancers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
