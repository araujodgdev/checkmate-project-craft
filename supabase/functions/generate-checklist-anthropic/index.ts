
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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
    const { project } = await req.json();

    if (!project?.name || !project?.type || !project?.technologies) {
      return new Response(JSON.stringify({ error: "Dados do projeto insuficientes." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Montar o prompt
    const { name, description = "", type, technologies = [], objectives = "" } = project;
    const prompt = `
Você é um especialista em desenvolvimento de software.
Gere uma checklist detalhada (10 a 14 itens) para organização e entrega de um projeto com as seguintes caraterísticas:

- Nome do projeto: ${name}
- Descrição: ${description}
- Tipo do projeto: ${type}
- Tecnologias principais: ${technologies.join(", ")}
- Objetivos: ${objectives}

A checklist deve ser prática e cobrir planejamento, autenticação, lógica, integrações, qualidade de código e entrega do produto.
Formato da resposta estritamente:
CHECKLIST:
1. [Passo mais importante 1]
2. [Passo importante 2]
...
(Obs: não inclua textos extras, apenas a lista numerada e clara).`;

    // Chamada Anthropic/Claude 3.5-Haiku
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Faltando ANTHROPIC_API_KEY." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const anthropicPayload = {
      model: "claude-3.5-haiku-20240307",
      max_tokens: 1024,
      temperature: 0.2,
      messages: [
        { role: "user", content: prompt }
      ]
    };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify(anthropicPayload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      return new Response(JSON.stringify({ error: error?.error?.message || "Erro Anthropic" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ai = await response.json();
    // Capturar apenas resultado relevante
    let checklist = "";
    if (ai?.content && Array.isArray(ai.content)) {
      checklist = ai.content.map((c: any) => c.text).join("").trim();
    } else {
      checklist = ai?.content?.text || "";
    }

    // Extrair linhas checklist tipo array
    let items = checklist
      .split("\n")
      .map((l: string) => l.replace(/^\d+(\.|\))/,"").trim())
      .filter((l: string) => l.length > 0 && !l.toLowerCase().startsWith("checklist:"));

    // Caso checklist esteja toda em uma linha, dividir no ponto
    if (items.length < 4) {
      items = checklist.split(/[0-9]+\./).map((t: string) => t.trim()).filter(Boolean);
    }

    return new Response(JSON.stringify({ checklist: items }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro na função Edge:", error);
    return new Response(JSON.stringify({ error: error.message || "Erro inesperado" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
