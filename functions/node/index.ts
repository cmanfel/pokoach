import cors from "cors";
import {onRequest} from "firebase-functions/v2/https";
import {setGlobalOptions} from "firebase-functions/v2/options";
import {
  processUserPrompt as _processUserPrompt,
} from "./functions/processUserPrompt.js";

setGlobalOptions({region: "us-central1"});

const corsHandler = cors({origin: true});

export const processUserPrompt = onRequest(
  {timeoutSeconds: 540, secrets: ["OPENAI_API_KEY"]},
  (req, res) => {
    corsHandler(req, res, async () => {
      res.set("Access-Control-Allow-Origin", "*");
      const {prompt} = req.query;

      if (!prompt) {
        res.status(400).send("Please provide prompt as URL parameter.");
        return;
      }

      const responseText = await _processUserPrompt(prompt);
      if (responseText == null) {
        res.status(500).send("Error processing prompt");
        return;
      }

      res.status(200).send(responseText);
    });
  },
);1
