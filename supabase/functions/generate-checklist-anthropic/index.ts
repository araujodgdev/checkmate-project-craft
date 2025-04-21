
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
    // Log the raw request body for debugging
    const rawBody = await req.text();
    console.log("Raw request body:", rawBody);
    
    // Parse JSON safely
    let jsonBody;
    try {
      jsonBody = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("JSON parse error:", parseError.message);
      console.error("Invalid JSON received:", rawBody);
      return new Response(JSON.stringify({ 
        error: "Invalid JSON input", 
        details: parseError.message,
        received: rawBody.slice(0, 100) + (rawBody.length > 100 ? "..." : "")
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { project } = jsonBody;

    if (!project?.name || !project?.type || !project?.technologies) {
      console.error("Missing required project data:", JSON.stringify(jsonBody, null, 2));
      return new Response(JSON.stringify({ 
        error: "Dados do projeto insuficientes.",
        received: JSON.stringify(jsonBody)
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Montar o prompt
    const { name, description = "", type, technologies = [], objectives = "" } = project;
    console.log("Processing project:", { name, type, technologies: technologies.length });
    
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
      console.error("Missing API key: ANTHROPIC_API_KEY");
      return new Response(JSON.stringify({ error: "Faltando ANTHROPIC_API_KEY." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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

    // Log complete response for debugging
    const responseText = await response.text();
    console.log("Anthropic API response status:", response.status);
    console.log("Anthropic API response headers:", Object.fromEntries(response.headers.entries()));
    console.log("Anthropic API response body (first 100 chars):", responseText.slice(0, 100) + "...");

    if (!response.ok) {
      let errorDetail = "Unknown error";
      try {
        const errorJson = JSON.parse(responseText);
        errorDetail = errorJson?.error?.message || JSON.stringify(errorJson);
      } catch (e) {
        errorDetail = responseText.slice(0, 500);
      }
      
      console.error("Anthropic API error:", errorDetail);
      return new Response(JSON.stringify({ 
        error: "Erro na API da Anthropic", 
        details: errorDetail 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse response JSON safely
    let ai;
    try {
      ai = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse Anthropic response:", parseError.message);
      console.error("Invalid JSON from Anthropic (first 100 chars):", responseText.slice(0, 100) + "...");
      return new Response(JSON.stringify({ 
        error: "Erro no formato da resposta da Anthropic", 
        details: parseError.message
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Capturar apenas resultado relevante
    let checklist = "";
    if (ai?.content && Array.isArray(ai.content)) {
      checklist = ai.content.map((c: any) => c.text).join("").trim();
      console.log("Extracted checklist from content array");
    } else {
      checklist = ai?.content?.text || "";
      console.log("Extracted checklist from content.text");
    }

    console.log("Raw checklist (first 100 chars):", checklist.slice(0, 100) + "...");

    // Extrair linhas checklist tipo array
    let items = checklist
      .split("\n")
      .map((l: string) => l.replace(/^\d+(\.|\))/,"").trim())
      .filter((l: string) => l.length > 0 && !l.toLowerCase().startsWith("checklist:"));

    // Caso checklist esteja toda em uma linha, dividir no ponto
    if (items.length < 4) {
      console.log("Checklist has fewer than 4 items, trying alternative parsing");
      items = checklist.split(/[0-9]+\./).map((t: string) => t.trim()).filter(Boolean);
    }

    console.log("Final parsed items count:", items.length);
    
    return new Response(JSON.stringify({ checklist: items }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro na função Edge:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Erro inesperado",
      stack: error.stack
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
