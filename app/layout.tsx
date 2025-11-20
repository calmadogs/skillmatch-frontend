import type { Metadata } from "next";
import "./globals.css";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { Toaster } from "sonner";


export const metadata: Metadata = {
  title: "SkillMatch",
  description: "Conectando clientes e freelancers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <ReactQueryProvider>
          <Toaster richColors />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
