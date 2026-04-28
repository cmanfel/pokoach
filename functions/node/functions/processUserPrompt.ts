import {completePrompt} from "../utils/openAI.js";

const readQueryString = (value: unknown): string | null => {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }
  return null;
};

export const processUserPrompt = async (
  prompt: unknown,
): Promise<string | null> => {
  const promptValue = readQueryString(prompt);

  if (!promptValue) {
    return null;
  }

  return completePrompt(promptValue);
};
