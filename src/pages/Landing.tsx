
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { ThemeSwitch } from "@/components/theme-switch";
import { useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/auth", { state: { tab: "register" } });
  };

  return (
    <div className="min-h-screen flex flex-col relative
      bg-gradient-to-br from-blue-50 via-white to-blue-100
      dark:bg-gradient-to-br dark:from-[#1A1F2C] dark:via-[#22263B] dark:to-[#28355a]
      transition-colors">
      <header className="w-full flex justify-between items-center px-8 py-6 gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-blue-600 dark:text-blue-300" size={32} />
          <span className="font-bold text-2xl text-blue-700 dark:text-blue-200">CheckMate</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <Link to="/auth">
            <Button
              variant="outline"
              className="mr-2 hover:bg-blue-100 hover:text-blue-900 dark:hover:bg-blue-950 dark:hover:text-blue-200 transition-colors"
            >
              Entrar
            </Button>
          </Link>
          <Button
            className="hover:bg-blue-600 hover:text-white dark:hover:bg-blue-800 dark:hover:text-blue-50 transition-colors"
            onClick={handleRegisterClick}
          >
            Cadastrar
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 dark:text-blue-200 mb-4">
          Organize seu desenvolvimento com inteligência
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
          O CheckMate gera listas de tarefas personalizadas para o seu projeto, integrando autenticação segura, lógica inteligente e interface moderna.
        </p>
        <div className="flex gap-4">
          <Button
            size="lg"
            className="text-base hover:bg-blue-600 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white transition-colors"
            onClick={handleRegisterClick}
          >
            Começar
          </Button>
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
