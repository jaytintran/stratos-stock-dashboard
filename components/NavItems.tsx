"use client";

import { navItems } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItems = () => {
	const pathname = usePathname();
	return (
		<ul className="flex max-sm:flex-col flex-row p-2 max-sm:gap-3 gap-10 font-medium">
			{navItems.map(({ title, href }) => {
				const isActive = pathname === href;
				return (
					<li key={title}>
						<Link
							href={href}
							className={`hover:text-yellow-400 transition-colors ${
								isActive ? "text-white" : "text-gray-400"
							}`}
						>
							{title}
						</Link>
					</li>
				);
			})}
		</ul>
	);
};

export default NavItems;
