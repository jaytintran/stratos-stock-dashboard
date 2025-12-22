"use server";

import { connectToDatabase } from "@/database/mongoose";

export const getAllUsersForNewsEmail = async () => {
	try {
		const mongoose = await connectToDatabase();
		const db = mongoose.connection.db;
		if (!db) throw new Error("Database connection failed");
		const users = await db
			?.collection("user")
			.find(
				{ email: { $exists: true, $ne: null } },
				{ projection: { _id: 1, id: 1, name: 1, email: 1, country: 1 } }
			)
			.toArray();
		// filter out users without email and name
		// then map through them to return only the necessary data which are id, name, email, and country
		return users
			.filter((user) => user.email && user.name)
			.map((user) => ({
				id: user.id || user._id?.toString() || "",
				name: user.name,
				email: user.email,
			}));
	} catch (e) {
		console.log("Error fetching users for news email:", e);
		return [];
	}
};
