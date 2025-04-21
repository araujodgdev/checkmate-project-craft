
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col">
      <header className="w-full flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-blue-600" size={32} />
          <span className="font-bold text-2xl text-blue-700">CheckMate</span>
        </div>
        <div>
          <Link to="/auth">
            <Button variant="outline" className="mr-2">Entrar</Button>
          </Link>
          <Link to="/dashboard">
            <Button>Ir para Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">
          Organize seu desenvolvimento com inteligência.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
          O CheckMate gera listas de tarefas personalizadas para o seu projeto, integrando autenticação segura, lógica inteligente e interface moderna. Comece agora a otimizar o fluxo do seu time!
        </p>
        <div className="flex gap-4">
          <Link to="/auth">
            <Button size="lg" className="text-base">Começar</Button>
          </Link>
          <a
            href="https://docs.lovable.dev/"
            target="_blank"
            rel="noopener"
          >
            <Button size="lg" variant="secondary" className="text-base">
              Ver Documentação
            </Button>
          </a>
        </div>
      </main>

      <footer className="w-full py-6 text-center text-gray-400 font-light text-sm">
        Feito com 💙 usando React, Supabase e inteligência artificial.
      </footer>
    </div>
  );
}
