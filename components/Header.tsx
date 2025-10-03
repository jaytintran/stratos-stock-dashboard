import Image from "next/image";
import Link from "next/link";
import React from "react";
import NavItems from "./NavItems";
import UserDropdown from "./UserDropdown";

const Header = () => {
	return (
		<header className="sticky top-0 header">
			<div className="container mx-auto flex justify-between items-center px-6 py-4 text-gray-500">
				<Link
					href={"/"}
					className="flex gap-1 items-center cursor-pointer w-auto"
				>
					<Image
						src={"/assets/icons/logo-2.svg"}
						alt="Stratos Logo"
						width={35}
						height={35}
					/>
					<p className="max-sm:hidden inline uppercase font-bold text-white antialiased">
						Stratos
					</p>
				</Link>

				<nav className="max-sm:hidden block">
					{/* Nav Items */}
					<NavItems />
				</nav>

				{/* User Dropdown in Mobile */}
				<div className="">
					<UserDropdown />
				</div>
			</div>
		</header>
	);
};

export default Header;
