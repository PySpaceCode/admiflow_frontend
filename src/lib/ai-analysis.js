/**
 * NVIDIA Mistral AI Analysis Service
 * Integrates Mistral-7B via NVIDIA API for high-fidelity document analysis.
 */

const NVIDIA_API_KEY = process.env.NEXT_PUBLIC_MISTRAL_API_KEY;
const BASE_URL = "https://integrate.api.nvidia.com/v1";

export async function analyzeWithMistral(content, onChunk) {
  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct-v0.3",
        messages: [
          {
            role: "system",
            content: "You are the Senior Intelligence Strategist for AdmitFlow. Your mission is to provide a high-fidelity 'Neural Deep-Dive' into institutional documents. Instead of just extracting data, you must provide a strategic analysis: 1. Strategic Identity (Brand positioning), 2. Enrollment Edge (What makes them win), 3. Potential Conversion Gaps (What students might worry about), and 4. Sales Protocol recommendations for the AI Agent. Use a professional, analytical tone with clear headings."
          },
          {
            role: "user",
            content: `Perform a deep-dive neural analysis on this institutional knowledge repository:\n\n${content}`
          }
        ],
        temperature: 0.3,
        top_p: 0.8,
        max_tokens: 3072,
        stream: true
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Mistral analysis failed');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices[0].delta.content;
            if (delta) {
              fullContent += delta;
              if (onChunk) onChunk(delta, fullContent);
            }
          } catch (e) {
            console.error('Error parsing stream chunk', e);
          }
        }
      }
    }

    return fullContent;
  } catch (err) {
    console.error('Mistral Analysis Error:', err);
    throw err;
  }
}
