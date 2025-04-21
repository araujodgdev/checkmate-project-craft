
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    const { projectDetails } = await req.json();
    
    if (!projectDetails) {
      return new Response(
        JSON.stringify({ error: "Detalhes do projeto são obrigatórios" }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    // Obter a chave da API
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY não encontrada nas variáveis de ambiente");
      return new Response(
        JSON.stringify({ 
          error: "API key não configurada no servidor" 
        }),
        { 
          status: 500, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      );
    }

    // Montar o prompt para a API da Anthropic
    const prompt = `
Você é um especialista em desenvolvimento de software.
Gere uma checklist detalhada (10 a 14 itens) para organização e entrega de um projeto com as seguintes caraterísticas:

- Nome do projeto: ${projectDetails.name}
- Descrição: ${projectDetails.description}
- Tipo do projeto: ${projectDetails.type}
- Tecnologias principais: ${projectDetails.technologies.join(", ")}
- Objetivos: ${projectDetails.objectives}

A checklist deve ser prática e cobrir planejamento, autenticação, lógica, integrações, qualidade de código e entrega do produto.
Formato da resposta estritamente:
CHECKLIST:
1. [Passo mais importante 1]
2. [Passo importante 2]
...
(Obs: não inclua textos extras, apenas a lista numerada e clara).`;

    // Chamada para a API da Anthropic
    console.log("Enviando requisição para API da Anthropic...");
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1024,
        temperature: 0.2,
        messages: [
          { role: "user", content: prompt }
        ]
      }),
    });

    // Log do status da resposta
    console.log("Status da resposta da API:", response.status);
    
    // Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro da API da Anthropic:", errorText);
      throw new Error(`Erro na API da Anthropic (${response.status}): ${errorText}`);
    }

    // Processar a resposta
    const data = await response.json();
    console.log("Resposta da API (primeiros 100 caracteres):", 
      JSON.stringify(data).slice(0, 100) + "...");
    
    // Extrair o texto da resposta
    let checklist = "";
    if (data?.content && Array.isArray(data.content)) {
      checklist = data.content.map((c: any) => c.text).join("").trim();
    } else {
      checklist = data?.content?.text || "";
    }
    
    console.log("Checklist extraída (primeiros 100 caracteres):", 
      checklist.slice(0, 100) + "...");

    // Processar a checklist em itens
    let items = checklist
      .split("\n")
      .map((l: string) => l.replace(/^\d+(\.|\))/,"").trim())
      .filter((l: string) => l.length > 0 && !l.toLowerCase().startsWith("checklist:"));

    // Caso checklist esteja toda em uma linha, dividir no ponto
    if (items.length < 4) {
      console.log("Checklist com menos de 4 itens, tentando parsing alternativo");
      items = checklist.split(/[0-9]+\./).map((t: string) => t.trim()).filter(Boolean);
    }
    
    console.log("Número final de itens processados:", items.length);
    
    return new Response(
      JSON.stringify({ items }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Erro interno do servidor" 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
