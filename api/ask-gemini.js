// Serverless Function (Vercel API Route)
import { GoogleGenerativeAI } from "@google/generative-ai";

// A chave será carregada automaticamente da Variável de Ambiente configurada no Vercel
const API_KEY = process.env.GEMINI_API_KEY; 
const MODEL_NAME = "gemini-2.5-pro";

if (!API_KEY) {
  console.error("GEMINI_API_KEY não está configurada como Variável de Ambiente.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

// Função que o Vercel executa ao receber a requisição
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    // Extrai a pergunta e os dados do corpo da requisição
    const { question, dadosDoUsuario } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'A pergunta do usuário é obrigatória.' });
    }

    const contextoDosDados = dadosDoUsuario
      ? JSON.stringify(dadosDoUsuario, null, 2)
      : "Não há dados de gastos disponíveis.";

    const prompt = `
        Você é um assistente financeiro. 
        Analise os seguintes dados do usuário (em formato JSON):
        
        --- Início dos Dados ---
        ${contextoDosDados}
        --- Fim dos Dados ---
        
        Com base APENAS nos dados fornecidos acima, 
        responda à seguinte pergunta do usuário:
        "${question}"
    `;

    console.log("Enviando prompt para a IA (servidor):", prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Retorna o texto gerado pela IA ao front-end
    return res.status(200).json({ text: text });

  } catch (error) {
    console.error("Erro ao chamar a API Gemini (servidor):", error);
    return res.status(500).json({ error: 'Erro interno do servidor ao processar a pergunta.' });
  }
}