
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { ThemeSwitch } from "@/components/theme-switch";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col relative
      bg-gradient-to-br from-blue-50 via-white to-blue-100
      dark:bg-gradient-to-br dark:from-[#1A1F2C] dark:via-[#222] dark:to-[#335]
      transition-colors">
      {/* Switch de tema canto superior direito, bem posicionado */}
      <div className="absolute top-5 right-5 z-50">
        <ThemeSwitch />
      </div>
      <header className="w-full flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-blue-600 dark:text-blue-300" size={32} />
          <span className="font-bold text-2xl text-blue-700 dark:text-blue-200">CheckMate</span>
        </div>
        <div>
          <Link to="/auth">
            <Button
              variant="outline"
              className="mr-2 hover:bg-blue-100 hover:text-blue-900 dark:hover:bg-blue-950 dark:hover:text-blue-200 transition-colors"
            >
              Entrar
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button
              className="hover:bg-blue-600 hover:text-white dark:hover:bg-blue-800 dark:hover:text-blue-50 transition-colors"
            >
              Ir para Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 dark:text-blue-200 mb-4">
          Organize seu desenvolvimento com inteligência.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
          O CheckMate gera listas de tarefas personalizadas para o seu projeto, integrando autenticação segura, lógica inteligente e interface moderna. Comece agora a otimizar o fluxo do seu time!
        </p>
        <div className="flex gap-4">
          <Link to="/auth">
            <Button
              size="lg"
              className="text-base hover:bg-blue-600 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white transition-colors"
            >
              Começar
            </Button>
          </Link>
          <a
            href="https://docs.lovable.dev/"
            target="_blank"
            rel="noopener"
          >
            <Button
              size="lg"
              variant="secondary"
              className="text-base hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-900 dark:hover:text-blue-200 transition-colors"
            >
              Ver Documentação
            </Button>
          </a>
        </div>
      </main>

      <footer className="w-full py-6 text-center text-gray-400 font-light text-sm dark:text-gray-500">
        Feito com 💙 usando React, Supabase e inteligência artificial.
      </footer>
    </div>
  );
}
