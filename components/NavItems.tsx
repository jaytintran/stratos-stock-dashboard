"use client";

import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchCommand from "./SearchCommand";

const NavItems = ({
	initialStocks,
}: {
	initialStocks: StockWithWatchlistStatus[];
}) => {
	const pathname = usePathname();

	return (
		<ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
			{NAV_ITEMS.map(({ label, href }) => {
				if (href === "/search")
					return (
						<li key="search-trigger">
							<SearchCommand
								renderAs="text"
								label="Search"
								initialStocks={initialStocks}
							/>
						</li>
					);
				return (
					<li key={label}>
						<Link
							href={href}
							className={`hover:text-yellow-400 hover:cursor-pointer transition-colors`}
						>
							{label}
						</Link>
					</li>
				);
			})}
		</ul>
	);
};

export default NavItems;
