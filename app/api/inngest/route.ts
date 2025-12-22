// Import the serve function from Inngest's Next.js integration
import { serve } from "inngest/next";

// Import your Inngest client configuration
import { inngestClient } from "@/lib/inngest/client";

// Import the background functions you want to register
import { sendSignUpEmail, sendDailyNewsSummary } from "@/lib/inngest/functions";

// Create HTTP handlers (GET, POST, PUT) for the Inngest endpoint
export const { GET, POST, PUT } = serve({
	client: inngestClient, // Your Inngest client instance
	functions: [sendSignUpEmail, sendDailyNewsSummary], // Array of functions Inngest can trigger
});
