"use client";

import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchCommand from "./SearchCommand";
import { TrendingUp } from "lucide-react";

const NavItems = () => {
	const pathname = usePathname();
	const isActive = (path: string) => {
		if (path === "/") return pathname === "/";

		return pathname.startsWith(path);
	};
	return (
		<ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
			{NAV_ITEMS.map(({ label, href }) => {
				if (label === "Search")
					return (
						<li key="search-trigger">
							<SearchCommand
								renderAs="text"
								label="Search"
								initialStocks={[
									{
										symbol: "TST",
										name: "Test",
										exchange: "NASDAQ",
										type: "Common Stock",
										isInWatchlist: false,
									},
								]}
							/>
						</li>
					);
				return (
					<li key={label}>
						<Link
							href={href}
							className={`hover:text-yellow-400 hover:cursor-pointer transition-colors ${
								isActive(href) ? "text-white" : "text-gray-400"
							}`}
						>
							<TrendingUp className="w-4 h-4 text-gray-500" />
							<div className="flex-1">
								<div className="search-item-name">{stock.name}</div>
							</div>
						</Link>
					</li>
				);
			})}
		</ul>
	);
};

export default NavItems;
