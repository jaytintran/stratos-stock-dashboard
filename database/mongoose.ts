import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
	var mongooseCache: {
		conn: typeof mongoose | null;
		promise: Promise<typeof mongoose> | null;
	};
}

let cache = global.mongooseCache;

if (!cache) {
	cache = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
	if (!MONGODB_URI) {
		throw new Error(
			"Please define the MONGODB_URI environment variable inside .env"
		);
	}

	if (cache.conn) {
		return cache.conn;
	}

	if (!cache.promise) {
		cache.promise = mongoose.connect(MONGODB_URI, {
			bufferCommands: false,
		});
	}

	try {
		cache.conn = await cache.promise;
	} catch (error) {
		cache.promise = null;
		throw error;
	}

	console.log(
		`Connected to MongoDB at ${process.env.NODE_ENV} - ${MONGODB_URI}`
	);

	return cache.conn;
};
