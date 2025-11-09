export default async function handler(req, res) {
  // 1. Apenas permitir requisições POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Pegar a chave secreta das Environment Variables
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    // 3. Pegar os dados que o seu HTML enviou
    const { question, data } = req.body;

    // 4. Montar o prompt aqui no servidor
    const prompt = `Você é um assistente financeiro chamado Gemini. Com base nos seguintes dados de gastos:\n${JSON.stringify(
      data
    )}\nResponda à seguinte pergunta: ${question}`;

    // 5. Usar o endpoint da API do Google AI Studio
    // Vamos usar o gemini-1.5-flash que é rápido e moderno
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // 6. Fazer a chamada segura para o Google
    const googleResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!googleResponse.ok) {
      const errorBody = await googleResponse.json();
      console.error('Erro da API do Google:', errorBody);
      return res.status(googleResponse.status).json({ error: 'Erro na API do Google' });
    }

    const result = await googleResponse.json();
    const aiResponse = result.candidates[0].content.parts[0].text;

    // 7. Enviar a resposta de volta para o iareports.html
    return res.status(200).json({ response: aiResponse });

  } catch (error) {
    console.error('Erro interno do servidor:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}