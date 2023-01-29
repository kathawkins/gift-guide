import { Configuration, OpenAIApi } from "openai";
import type { NextApiRequest, NextApiResponse } from "next";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!req.body.text) {
    return res.status(400).send({ message: "Bad request." });
  }
  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: req.body.text,
    temperature: 0.7,
    max_tokens: 150,
  });

  res.status(200).json({ result: completion.data });
}
