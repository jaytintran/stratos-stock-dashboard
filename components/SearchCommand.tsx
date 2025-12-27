import React, { useEffect } from "react";
import { useState } from "react";
import {
	CommandEmpty,
	CommandDialog,
	CommandList,
	CommandInput,
	CommandGroup,
	CommandItem,
} from "./ui/command";
import { Button } from "./ui/button";
import { Loader2, TrendingUp } from "lucide-react";
import Link from "next/link";

const SearchCommand = ({
	renderAs = "button",
	label = "Add Stock",
	initialStocks = [],
}: SearchCommandProps) => {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [stocks, setStocks] = useState(initialStocks);

	const isSearchMode = !!searchTerm.trim();
	const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && e.metaKey) {
				e.preventDefault();
				setOpen((previousState) => !previousState);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const handleSelectStock = (value: string) => {
		console.log("Selected stock");
		setOpen(false);
	};

	return (
		<>
			{renderAs === "text" ? (
				<span onClick={() => setOpen(true)} className="search-text">
					{label}
				</span>
			) : (
				<Button onClick={() => setOpen(true)} className="search-btn">
					{label}
				</Button>
			)}
			<CommandDialog
				open={open}
				onOpenChange={setOpen}
				className="search-dialog"
			>
				<div className="search-field">
					<CommandInput
						placeholder="Search stock..."
						value={searchTerm}
						onValueChange={setSearchTerm}
						className="search-input"
					/>

					{loading && (
						<div className="search-loader">
							<Loader2 />
						</div>
					)}
				</div>

				<CommandList className="search-list">
					{/* <CommandEmpty>
						{loading ? "Loading..." : "No results found."}
					</CommandEmpty> */}

					<CommandGroup heading="Stocks">
						{loading && (
							<CommandEmpty className="search-list-empty">
								Loading stocks ...
							</CommandEmpty>
						)}

						{!loading && displayStocks?.length === 0 && (
							<div className="search-list-indicator">
								{isSearchMode ? "No results found" : "No stock available"}
							</div>
						)}

						{!loading && displayStocks?.length > 0 && (
							<ul>
								<div className="search-count">
									{isSearchMode ? "Search results" : "Popular stocks"} (
									{displayStocks.length})
								</div>

								{displayStocks?.map((stock) => (
									<li key={stock.symbol} className="search-item">
										<Link
											href={`/stock/${stock.symbol}`}
											className="search-item-link"
											onClick={() => handleSelectStock(stock.symbol)}
										>
											<TrendingUp className="w-4 h-4 text-gray-500" />
											<div className="flex-1">
												<div className="search-item-name">{stock.name}</div>
											</div>
										</Link>
									</li>
								))}
							</ul>
						)}
						{/* <CommandItem value="AAPL" onSelect={handleSelectStock}>
							APPL
						</CommandItem>
						<CommandItem value="GOOGL" onSelect={handleSelectStock}>
							GOOGL
						</CommandItem>
						<CommandItem value="MSFT" onSelect={handleSelectStock}>
							MSFT
						</CommandItem> */}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
};

export default SearchCommand;
