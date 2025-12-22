"use server";

import { connectToDatabase } from "@/database/mongoose";

/**
 * Get all watchlist symbols for a user by their email address
 * @param email - User's email address
 * @returns Array of stock symbols (strings) from the user's watchlist
 */
export const getWatchlistSymbolsByEmail = async (
	email: string
): Promise<string[]> => {
	try {
		// Step 1: Connect to the database
		const mongoose = await connectToDatabase();
		const db = mongoose.connection.db;

		// Safety check: ensure database connection is successful
		if (!db) {
			console.error("Database connection failed");
			return [];
		}

		// Step 2: Find the user by email in the users collection (Better Auth)
		const user = await db.collection("users").findOne(
			{ email },
			{ projection: { _id: 1, id: 1 } } // Only get the ID fields we need
		);

		// Step 3: If no user found, return empty array
		if (!user) {
			console.log(`No user found with email: ${email}`);
			return [];
		}

		// Get the user ID (Better Auth uses 'id' field, fallback to '_id')
		const userId = user.id || user._id?.toString();

		if (!userId) {
			console.error("User ID not found");
			return [];
		}

		// Step 4: Query the Watchlist collection by userId
		const watchlistItems = await db
			.collection("watchlists")
			.find(
				{ userId },
				{ projection: { symbol: 1, _id: 0 } } // Only get the symbol field
			)
			.toArray();

		// Step 5: Extract and return just the symbols as strings
		const symbols = watchlistItems.map((item) => item.symbol as string);

		return symbols;
	} catch (error) {
		// Log the error and return empty array (fail gracefully)
		console.error("Error fetching watchlist symbols:", error);
		return [];
	}
};

