import {logger} from "firebase-functions";
type OpenAiResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export const completePrompt = async (
  prompt: string,
): Promise<string | null> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    logger.error("OPENAI_API_KEY is not configured");
    return null;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        messages: [{role: "user", content: prompt}],
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      logger.error("OpenAI API request failed", {
        status: response.status,
        details,
      });
      return null;
    }

    const data = (await response.json()) as OpenAiResponse;
    const text = data.choices?.[0]?.message?.content?.trim();
    return text ?? null;
  } catch (error) {
    logger.error("OpenAI request failed", {error});
    return null;
  }
};
