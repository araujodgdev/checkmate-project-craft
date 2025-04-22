import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { ThemeSwitch } from "@/components/theme-switch";
import Typewriter from 'typewriter-effect';

export default function Landing() {
  const navigate = useNavigate();

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/auth", { state: { tab: "register" } });
  };

  const features = [
    {
      icon: "⚡",
      title: "Checklists Inteligentes",
      description: "Criação automática de checklists baseados no seu projeto"
    },
    {
      icon: "🤝",
      title: "Colaboração em Equipe",
      description: "Acompanhamento em tempo real do progresso do projeto"
    },
    {
      icon: "🔄",
      title: "Atualizações em Tempo Real",
      description: "Sincronização automática de mudanças entre a equipe"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1A1F2C] via-[#22263B] to-[#28355a]">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="text-blue-400" size={32} />
          <span className="font-bold text-2xl text-blue-100">CheckMate</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitch />
          <Link to="/auth">
            <Button variant="outline" className="text-blue-100 border-blue-400 hover:bg-blue-900/20">
              Entrar
            </Button>
          </Link>
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white"
            onClick={handleRegisterClick}
          >
            Começar Agora
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <div className="text-center max-w-4xl mx-auto px-4 pt-20 pb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Gerenciamento Eficiente para
            <div className="text-blue-400 mt-2">
              <Typewriter
                options={{
                  strings: ['Desenvolvedores', 'Times de Tech', 'Projetos Ágeis'],
                  autoStart: true,
                  loop: true,
                }}
              />
            </div>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Nunca perca um passo importante no desenvolvimento. Organize, acompanhe e gerencie seus projetos com inteligência.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleRegisterClick}
            >
              Comece Gratuitamente
            </Button>
            <Link to="/auth">
              <Button
                size="lg"
                variant="outline"
                className="text-blue-100 border-blue-400 hover:bg-blue-900/20"
              >
                Ver Demonstração
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-[#1A1F2C]/50 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-4">
              Potencialize seu Fluxo de Desenvolvimento
            </h2>
            <p className="text-center text-gray-300 mb-12">
              O CheckMate fornece tudo que os desenvolvedores precisam para gerenciar projetos de forma eficiente.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="bg-[#22263B] p-6 rounded-lg border border-blue-900/30">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-blue-100 mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 py-16">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para Otimizar seu Fluxo de Desenvolvimento?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Junte-se a milhares de desenvolvedores que usam o CheckMate para gerenciar seus projetos de forma mais eficiente.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
              onClick={handleRegisterClick}
            >
              Começar Agora
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1F2C] text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Produto</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-blue-400">Features</a></li>
                <li><a href="#pricing" className="hover:text-blue-400">Preços</a></li>
                <li><a href="#docs" className="hover:text-blue-400">Documentação</a></li>
                <li><a href="#updates" className="hover:text-blue-400">Atualizações</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Recursos</h3>
              <ul className="space-y-2">
                <li><a href="#blog" className="hover:text-blue-400">Blog</a></li>
                <li><a href="#tutorials" className="hover:text-blue-400">Tutoriais</a></li>
                <li><a href="#support" className="hover:text-blue-400">Suporte</a></li>
                <li><a href="#changelog" className="hover:text-blue-400">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="hover:text-blue-400">Sobre</a></li>
                <li><a href="#careers" className="hover:text-blue-400">Carreiras</a></li>
                <li><a href="#contact" className="hover:text-blue-400">Contato</a></li>
                <li><a href="#partners" className="hover:text-blue-400">Parceiros</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#privacy" className="hover:text-blue-400">Privacidade</a></li>
                <li><a href="#terms" className="hover:text-blue-400">Termos de Uso</a></li>
                <li><a href="#cookies" className="hover:text-blue-400">Cookies</a></li>
                <li><a href="#licenses" className="hover:text-blue-400">Licenças</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>© 2025 CheckMate. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
