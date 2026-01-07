"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
	CommandEmpty,
	CommandDialog,
	CommandList,
	CommandInput,
	CommandGroup,
	CommandItem,
} from "./ui/command";
import { Button } from "./ui/button";
import { Loader2, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { useDebounce } from "@/app/hooks/useDebounce";

const SearchCommand = ({
	renderAs = "button",
	label = "Add Stock",
	initialStocks = [],
}: SearchCommandProps) => {
	// ===== STATE MANAGEMENT =====
	// Controls whether the search dialog is visible
	const [open, setOpen] = useState(false);
	// Tracks user's search input in real-time
	const [searchTerm, setSearchTerm] = useState("");
	// Shows loading spinner while fetching stocks from API
	const [loading, setLoading] = useState(false);
	// Stores the list of stocks to display (either search results or initial stocks)
	const [stocks, setStocks] =
		useState<StockWithWatchlistStatus[]>(initialStocks);

	// ===== COMPUTED VALUES =====
	// Determines if user is actively searching (has entered text)
	const isSearchMode = !!searchTerm.trim();
	// Shows all stocks in search mode, or only first 10 stocks when browsing
	const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

	// ===== KEYBOARD SHORTCUT (CMD+K or CTRL+K) =====
	// Sets up global keyboard listener to toggle search dialog with CMD/CTRL+K
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen((previousState) => !previousState);
			}
		};

		document.addEventListener("keydown", down);
		// Cleanup: remove listener when component unmounts
		return () => document.removeEventListener("keydown", down);
	}, []);

	// ===== SEARCH HANDLER =====
	// Fetches stock data from API based on search term
	// useCallback prevents recreation on every render (only recreates if initialStocks changes)
	const handleSearch = useCallback(
		async (term: string) => {
			// If search is empty, reset to initial stocks
			if (!term.trim()) return setStocks(initialStocks);

			setLoading(true);
			try {
				// Call API to search for stocks matching the term
				const results = await searchStocks(term.trim());
				setStocks(results);
				console.log(results);
			} catch {
				// If API fails, show empty list
				setStocks([]);
			} finally {
				// Always stop loading spinner, whether success or failure
				setLoading(false);
			}
		},
		[initialStocks]
	);

	// ===== DEBOUNCED SEARCH =====
	// Delays search execution by 300ms to avoid firing on every keystroke
	// This reduces unnecessary API calls while user is still typing
	const debouncedSearch = useDebounce(() => handleSearch(searchTerm), 300);

	// Trigger debounced search whenever searchTerm changes
	useEffect(() => {
		debouncedSearch();
	}, [searchTerm]);

	// ===== STOCK SELECTION HANDLER =====
	// Closes dialog and resets state when user clicks on a stock
	const handleSelectStock = (value: string) => {
		setOpen(false);
		setSearchTerm("");
		setStocks(initialStocks);
	};

	// ===== RENDER =====
	return (
		<>
			{/* Trigger button/text that opens the search dialog */}
			{renderAs === "text" ? (
				<span onClick={() => setOpen(true)} className="search-text">
					{label}
				</span>
			) : (
				<Button onClick={() => setOpen(true)} className="search-btn">
					{label}
				</Button>
			)}

			{/* Search Dialog Modal */}
			<CommandDialog
				open={open}
				onOpenChange={setOpen}
				className="search-dialog"
			>
				{/* Search Input Field */}
				<div className="search-field">
					<CommandInput
						placeholder="Search stock..."
						value={searchTerm}
						onValueChange={setSearchTerm}
						className="search-input"
					/>

					{/* Loading Spinner (shows during API call) */}
					{loading && (
						<div className="search-loader">
							<Loader2 />
						</div>
					)}
				</div>

				{/* Search Results List */}
				<CommandList className="search-list">
					<CommandGroup heading="Stocks">
						{/* Loading State: Show "Loading..." message */}
						{loading && (
							<CommandEmpty className="search-list-empty">
								Loading stocks ...
							</CommandEmpty>
						)}

						{/* Empty State: Show when no stocks found */}
						{!loading && displayStocks?.length === 0 && (
							<div className="search-list-indicator">
								{isSearchMode ? "No results found" : "No stock available"}
							</div>
						)}

						{/* Results State: Show stock list */}
						{!loading && displayStocks?.length > 0 && (
							<>
								{/* Header showing result count */}
								<div className="search-count px-2 py-1 text-sm text-gray-500">
									{isSearchMode ? "Search results" : "Popular stocks"} (
									{displayStocks.length})
								</div>

								{/* Map through stocks and render each as a clickable item */}
								{displayStocks?.map((stock, i) => (
									<CommandItem
										key={stock.symbol || i}
										value={stock.symbol}
										onSelect={() => handleSelectStock(stock.symbol)}
									>
										<Link
											href={`/stock/${stock.symbol}`}
											className="search-item-link flex items-center gap-2 w-full"
										>
											<TrendingUp className="w-4 h-4 text-gray-500" />
											<div className="flex-1">
												<div className="search-item-name">{stock.name}</div>
												<div className="text-sm text-gray-500">
													{stock.symbol} | {stock.exchange} | {stock.type}
												</div>
											</div>
											<Star />
										</Link>
									</CommandItem>
								))}
							</>
						)}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
};

export default SearchCommand;
