import {logger} from "firebase-functions";
import {OpenAiHelper} from "../utils/openAI.js";

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
  uid: unknown,
  listingId: unknown,
): Promise<string | null> => {
  const uidValue = readQueryString(uid);
  const listingIdValue = readQueryString(listingId);

  if (!uidValue || !listingIdValue) {
    return null;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    logger.error("OPENAI_API_KEY is not configured");
    return null;
  }

  const prompt = [
    "Generate photo instructions for listing",
    listingIdValue,
    "and user",
    uidValue,
  ].join(" ");

  const helper = new OpenAiHelper(
    apiKey,
    process.env.OPENAI_MODEL ?? "gpt-4o-mini",
  );
  return helper.completePrompt(prompt);
};
