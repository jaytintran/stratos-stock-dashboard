import { sendWelcomeEmail } from "../nodemailer";
import { inngestClient } from "./client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";

export const sendSignUpEmail = inngestClient.createFunction(
	{ id: "sign-up-email" },
	{ event: "app/user.created" },
	async ({ event, step }) => {
		const userProfile = `
            - Country: ${event.data.country}
            - Investment Goals: ${event.data.investmentGoals}
            - Risk Tolerance: ${event.data.riskTolerance}
            - Preferred Industries: ${event.data.preferredIndustries}
        `;

		const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
			"{{userProfile}}",
			userProfile
		);

		const response = await step.ai.infer("generate-welcome-intro", {
			model: step.ai.models.gemini({ model: "gemini-2.0-flash-lite" }),
			body: {
				contents: [{ role: "user", parts: [{ text: prompt }] }],
			},
		});

		await step.run("send-welcome-email", async () => {
			const part = response.candidates?.[0]?.content?.parts?.[0];
			const introText =
				(part && "text" in part ? part.text : null) ||
				"Thanks for joining Stratos. You now have a tool to track markets and make smarter moves!";

			const {
				data: { email, name },
			} = event;

			return await sendWelcomeEmail({
				email,
				name,
				intro: introText,
			});
		});

		return {
			success: true,
			message: "Welcome email sent successfully!",
		};
	}
);
