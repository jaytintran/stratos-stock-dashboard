// Import the main Better Auth library for authentication
import { betterAuth } from "better-auth";

// Import MongoDB adapter to connect Better Auth with MongoDB database
import { mongodbAdapter } from "better-auth/adapters/mongodb";

// Import our custom database connection function
import { connectToDatabase } from "@/database/mongoose";

// Import Next.js cookies plugin for session management
import { nextCookies } from "better-auth/next";

// Create a variable to store our auth instance (starts as null)
// This prevents creating multiple auth instances (singleton pattern)
let authInstance: ReturnType<typeof betterAuth> | null = null;

// Function to get or create the auth instance
// Async because we need to wait for the database connection
export const getAuth = async () => {
	// Check if we already have an auth instance created
	if (authInstance) {
		// If yes, return the exisiting one (no need to recreate)
		return authInstance;
	} else {
		// If no auth instance exists, we need to create one
		// First, connect to the database and wait for it to complete
		const mongoose = await connectToDatabase();

		// Get the actual MongoDB database object from mongoose
		const db = mongoose.connection.db;

		// Safety check: make sure database connection was successful
		if (!db) {
			throw new Error("Database connection failed");
		}

		// Now create the Better Auth instance with our configuration
		authInstance = betterAuth({
			// Connect Better Auth to your MongoDB database
			database: mongodbAdapter(db),

			// Secret key for encrypting sessions and tokens (from .env file)
			secret: process.env.BETTER_AUTH_SECRET,

			// Base URL of your app (from .env file) - used for redirects and callbacks
			baseURL: process.env.BETTER_AUTH_URL,

			// Configure email/password authentication
			emailAndPassword: {
				enabled: true, // Allow users to sign up with email/password
				disableSignUp: false, // Allow new user registration
				requireEmailVerification: false, // Don't require email verification (for development)
				minPasswordLength: 8, // Passwords must be at least 8 characters
				maxPasswordLength: 128, // Passwords can't exceed 128 characters
				autoSignIn: true, // Automatically sign in user after successful registration
			},

			// Add Next.js cookies plugin for session management
			plugins: [nextCookies()],
		});

		// Finally return the newly created auth instance
		return authInstance;
	}
};

// Create and export the auth instance to use throughout the app
// This will be run wherever the module is imported
export const auth = await getAuth();
