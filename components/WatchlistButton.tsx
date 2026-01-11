"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
	symbol: string;
	company: string;
	isInWatchlist: boolean;
}

const WatchlistButton = ({
	symbol,
	company,
	isInWatchlist,
}: WatchlistButtonProps) => {
	const [isWatched, setIsWatched] = useState(isInWatchlist);
	const [isLoading, setIsLoading] = useState(false);

	const handleToggleWatchlist = async () => {
		setIsLoading(true);
		try {
			// TODO: Add watchlist API call here
			setIsWatched(!isWatched);
		} catch (error) {
			console.error("Failed to update watchlist:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			onClick={handleToggleWatchlist}
			disabled={isLoading}
			variant={isWatched ? "default" : "outline"}
			className={cn(
				"flex items-center gap-2",
				isWatched && "bg-yellow-500 hover:bg-yellow-600 text-black"
			)}
		>
			<Star
				className={cn("w-4 h-4", isWatched ? "fill-current" : "fill-none")}
			/>
			{isLoading
				? "..."
				: isWatched
				? "Remove from Watchlist"
				: "Add to Watchlist"}
		</Button>
	);
};

export default WatchlistButton;
