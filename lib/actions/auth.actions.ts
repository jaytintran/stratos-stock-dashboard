"use server";

// Import Better Auth instance for authentication operations
// Better Auth is a modern authentication library that handles user registration, login, etc.
import { auth } from "@/lib/better-auth/auth";

// Import Inngest client for triggering background jobs
// Inngest is a service that handles background tasks like sending emails
import { inngestClient } from "@/lib/inngest/client";
import { headers } from "next/headers";

// Server action to handle user sign up with email
// This function is called when a user submits the sign-up form
// This function is tied to the getAuth in lib/better-auth/auth.ts which connects to the MongoDB database
export const signUpWithEmail = async (data: SignUpFormData) => {
	try {
		// Step 1: Create the user account using Better Auth
		// We send the user's email, password, and full name to Better Auth
		// auth.api.signUpEmail: is a method provided by the Better Auth library to create a new user account with hashing the password and storing the user's email and name in the database.
		const response = await auth.api.signUpEmail({
			body: {
				email: data.email,
				password: data.password,
				name: data.fullName,
			},
		});

		// Step 2: If user creation was successful, trigger background tasks
		// We only proceed if the response exists (user was created successfully)
		if (response) {
			// Send an event to Inngest to trigger the welcome email workflow
			// This happens in the background so the user doesn't have to wait
			const inngestResponse = await inngestClient.send({
				name: "app/user.created",
				data: {
					email: data.email,
					name: data.fullName,
					country: data.country,
					investmentGoals: data.investmentGoals,
					riskTolerance: data.riskTolerance,
					preferredIndustries: data.preferredIndustries,
				},
			});

			console.log("Inngest event sent: ", inngestResponse);
		} else {
			console.log("No response from Better Auth, skipping Inngest event");
		}

		// Step 3: Return success response to the client
		// This tells the frontend that everything worked correctly
		return {
			success: true,
			message: "Sign up successful",
			// Return the response from Better Auth
			data: response,
		};
	} catch (e) {
		// Step 4: Handle any errors that occur during the process
		// Log the error for debugging purposes
		console.log("Sign up failed", e);

		// Step 5: Return error response to the client
		// This tells the frontend that something went wrong
		return {
			success: false,
			message: "Sign up failed",
		};
	}
};

// Server action to handle sign out
export const signOut = async () => {
	try {
		await auth.api.signOut({
			headers: await headers(),
		});
	} catch (e) {
		console.log("Sign out failed", e);
		return {
			success: false,
			message: "Sign out failed",
		};
	}
};

// Server action to handle sign in
export const signInWithEmail = async (data: SignInFormData) => {
	try {
		await auth.api.signInEmail({
			body: {
				email: data.email,
				password: data.password,
			},
		});
	} catch (e) {
		console.log("Sign in failed", e);
		return {
			success: false,
			message: "Sign in failed",
		};
	}
};
