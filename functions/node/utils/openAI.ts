import {logger} from "firebase-functions";

type OpenAiResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export class OpenAiHelper {
  constructor(
    private readonly apiKey: string,
    private readonly model: string = "gpt-4o-mini",
  ) {}

  async completePrompt(prompt: string): Promise<string | null> {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
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
  }
}
