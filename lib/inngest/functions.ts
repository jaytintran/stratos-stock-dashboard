import { getAllUsersForNewsEmail } from "../actions/user.action";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { inngestClient } from "./client";
import {
	NEWS_SUMMARY_EMAIL_PROMPT,
	PERSONALIZED_WELCOME_EMAIL_PROMPT,
} from "./prompts";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { getNews } from "../actions/finnhub.actions";

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

// Step 1: Create an Inngest function with a unique identifier
// This function will handle sending daily news summaries to users
export const sendDailyNewsSummary = inngestClient.createFunction(
	{
		// Step 2: Define the function ID for tracking and debugging
		id: "daily-news-summary",
	},
	// Step 3: Configure triggers - this function can be triggered in two ways:
	// - Manually via the "app/send.daily.news" event
	// - Automatically via cron schedule at 12:00 PM (noon) every day
	[{ event: "app/send.daily.news" }, { cron: "0 12 * * *" }],
	async ({ step }) => {
		// Step 1: Get all users for news delivery
		const users = await step.run("get-all-users", async () => {
			const users = await getAllUsersForNewsEmail();
			return users;
		});

		if (!users || users.length === 0) {
			return {
				success: false,
				message: "No users found for news delivery",
			};
		}

		// Step 2: Fetch personalized news for each user
		const userNewsData = await step.run("fetch-user-news", async () => {
			const newsPromises = users.map(async (user) => {
				try {
					// Get user's watchlist symbols
					const symbols = await getWatchlistSymbolsByEmail(user.email);

					// Fetch news - either for their watchlist or general market news
					const news =
						symbols.length > 0 ? await getNews(symbols) : await getNews();

					return {
						user,
						news,
					};
				} catch (error) {
					console.error(`Error fetching news for ${user.email}:`, error);
					return {
						user,
						news: [],
					};
				}
			});

			return await Promise.all(newsPromises);
		});

		// Step 3: Summarize news via AI (placeholder for now)
		const userNewsSummary: { user: User; newsContent: string | null }[] = [];

		for (const { user, news } of userNewsData) {
			try {
				const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
					"{{newsData}}",
					JSON.stringify(news, null, 2)
				);

				const response = await step.ai.infer(`summarize-news-${user.email}`, {
					model: step.ai.models.gemini({ model: "gemini-2.0-flash-lite" }),
					body: {
						contents: [{ role: "user", parts: [{ text: prompt }] }],
					},
				});

				const part = response.candidates?.[0]?.content?.parts?.[0];
				const newsContent =
					(part && "text" in part ? part.text : null) || "No market news.";

				userNewsSummary.push({ user, newsContent });
			} catch (e) {
				console.error(`Fail to summarize news for ${user.email}:`, e);
				userNewsSummary.push({ user, newsContent: null });
			}
		}
		await step.run("summarize-news", async () => {
			// TODO: Implement AI summarization using step.ai.infer
			// For each user's news, generate a personalized summary
			console.log("AI summarization step - to be implemented");
			return { summarized: true };
		});

		// Step 4: Send the news summary emails (placeholder for now)
		await step.run("send-news-emails", async () => {
			// TODO: Implement email sending using nodemailer
			// Send personalized news summaries to each user
			// Promise all to send all emails at once
			await Promise.all(
				userNewsSummary.map(async ({ user, newsContent }) => {
					if (!newsContent) return;

					return await sendNewsSummaryEmail({
						email: user.email,
						date: new Date().toLocaleDateString(),
						newsContent,
					});
				})
			);
		});

		return {
			success: true,
			message: `Daily news summary processed for ${users.length} users`,
		};
	}
);
