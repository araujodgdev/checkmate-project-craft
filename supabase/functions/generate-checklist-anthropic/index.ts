
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response('ok', { headers });
  }

  try {
    // Improved error handling for JSON parsing
    let jsonBody;
    try {
      const rawBody = await req.text();
      console.log("Raw request body:", rawBody);
      
      if (!rawBody || rawBody.trim() === '') {
        return new Response(JSON.stringify({ 
          error: "Empty request body received" 
        }), {
          status: 400,
          headers,
        });
      }
      
      jsonBody = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      return new Response(JSON.stringify({ 
        error: "Invalid JSON input", 
        details: parseError.message 
      }), {
        status: 400,
        headers,
      });
    }

    console.log("Parsed request body:", JSON.stringify(jsonBody));
    
    const { project } = jsonBody || {};

    if (!project?.name || !project?.type || !project?.technologies) {
      return new Response(JSON.stringify({ 
        error: "Dados do projeto insuficientes.",
        received: JSON.stringify(jsonBody)
      }), {
        status: 400,
        headers,
      });
    }

    // Monta o prompt para a API da Anthropic
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

    // Chamada para Anthropic/Claude 3.5-Haiku
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Faltando ANTHROPIC_API_KEY." }), {
        status: 400,
        headers,
      });
    }

    const anthropicPayload = {
      model: "claude-3-5-haiku-20241022",
      max_tokens: 1024,
      temperature: 0.2,
      messages: [
        { role: "user", content: prompt }
      ]
    };

    console.log("Sending request to Anthropic API");
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify(anthropicPayload),
    });

    const responseText = await response.text();
    console.log("Anthropic API response:", responseText.slice(0, 200) + "...");

    if (!response.ok) {
      let errorDetail = "Unknown error";
      try {
        const errorJson = JSON.parse(responseText);
        errorDetail = errorJson?.error?.message || JSON.stringify(errorJson);
      } catch (e) {
        errorDetail = responseText.slice(0, 500);
      }
      return new Response(JSON.stringify({ 
        error: "Erro na API da Anthropic", 
        details: errorDetail 
      }), {
        status: 500,
        headers,
      });
    }

    // Parse da resposta da Anthropic
    let ai;
    try {
      ai = JSON.parse(responseText);
    } catch (parseError) {
      return new Response(JSON.stringify({ 
        error: "Erro no formato da resposta da Anthropic", 
        details: parseError.message
      }), {
        status: 500,
        headers,
      });
    }

    // Captura checklist relevante
    let checklist = "";
    if (ai?.content && Array.isArray(ai.content)) {
      checklist = ai.content.map((c) => c.text).join("").trim();
    } else {
      checklist = ai?.content?.text || "";
    }

    // Extrai as linhas checklist tipo array
    let items = checklist
      .split("\n")
      .map((l) => l.replace(/^\d+(\.|\))/,"").trim())
      .filter((l) => l.length > 0 && !l.toLowerCase().startsWith("checklist:"));

    // Alternativa se a checklist estiver densa
    if (items.length < 4) {
      items = checklist.split(/[0-9]+\./).map((t) => t.trim()).filter(Boolean);
    }

    return new Response(JSON.stringify({ checklist: items }), {
      headers,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ 
      error: error?.message || "Erro inesperado",
      stack: error?.stack
    }), {
      status: 500,
      headers,
    });
  }
});
