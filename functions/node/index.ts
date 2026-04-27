import cors from "cors";
import {onRequest} from "firebase-functions/v2/https";
import {setGlobalOptions} from "firebase-functions/v2/options";
import {processUserPrompt} from "./functions/processUserPrompt.js";

setGlobalOptions({region: "us-central1"});

const corsHandler = cors({origin: true});

export const setPhotos = onRequest({timeoutSeconds: 540}, (req, res) => {
  corsHandler(req, res, async () => {
    res.set("Access-Control-Allow-Origin", "*");
    const {uid, listingId} = req.query;

    if (!uid || !listingId) {
      res.status(400).send(
        "Please provide both uid and listingId as URL parameters.",
      );
      return;
    }

    const photos = await processUserPrompt(uid, listingId);
    if (photos == null) {
      res.status(500).send("Error setting photos");
      return;
    }

    res.status(200).send(photos);
  });
});
