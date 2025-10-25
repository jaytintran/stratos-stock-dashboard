import { Inngest } from "inngest";

export const inngestClient = new Inngest({
	id: "stratos",
	ai: { gemini: { apiKey: process.env.AI_API_KEY! } },
});
