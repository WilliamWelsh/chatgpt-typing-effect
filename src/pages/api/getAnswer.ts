/* eslint-disable import/no-anonymous-default-export */
import { type NextApiRequest, type NextApiResponse } from "next";
import { type CreateChatCompletionRequest } from "openai";

export default async (req: NextApiRequest, _: NextApiResponse) => {
  const { searchParams } = new URL(req.url);

  const question = searchParams.get("question");

  const request: CreateChatCompletionRequest = {
    model: "gpt-3.5-turbo",
    max_tokens: 512,
    stream: true,
    messages: [{ role: "user", content: question }],
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    body: JSON.stringify(request),
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      "Content-Type": "application/json",
    },
  });

  return new Response(response.body, {
    headers: { "Content-Type": "text/event-stream" },
  });
};

export const config = { runtime: "edge" };
