import mongoose, { Document, Model, Schema } from "mongoose";

// Define the interface for a Watchlist item that extends Mongoose Document
export interface WatchlistItem extends Document {
	userId: string;
	symbol: string;
	company: string;
	addedAt: Date;
}

// Define the Mongoose schema for the Watchlist collection
const WatchlistSchema = new Schema<WatchlistItem>(
	{
		userId: {
			type: String,
			required: true,
			index: true, // Index for faster queries by userId
		},
		symbol: {
			type: String,
			required: true,
			uppercase: true, // Automatically convert to uppercase
			trim: true, // Remove whitespace
		},
		company: {
			type: String,
			required: true,
			trim: true, // Remove whitespace
		},
		addedAt: {
			type: Date,
			default: Date.now, // Default to current timestamp
		},
	},
	{
		timestamps: true, // Automatically add createdAt and updatedAt fields
	}
);

// Create a compound index on userId + symbol to prevent duplicate entries
// This ensures a user can't add the same stock twice
WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

// Export the model using the singleton pattern to avoid hot-reload issues in Next.js
const Watchlist: Model<WatchlistItem> =
	mongoose.models?.Watchlist ||
	mongoose.model<WatchlistItem>("Watchlist", WatchlistSchema);

export default Watchlist;
