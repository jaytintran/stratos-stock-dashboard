import Image from "next/image";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="auth-layout scrollbar-hide-default">
			<section className="auth-left-section">
				<Link
					href="/"
					className="flex gap-1 items-center cursor-pointer w-auto pt-6 lg:pt-8 mb-8 lg:mb-12"
				>
					<Image
						src={"/assets/icons/logo-2.svg"}
						alt="Stratos Logo"
						width={50}
						height={50}
						className="h-auto w-15"
					/>
					<p className="max-sm:hidden inline uppercase font-bold text-white text-2xl antialiased">
						Stratos
					</p>
				</Link>
				<div className="flex-1 pb-6 lg:pb-8 ">{children}</div>
			</section>

			<section className="auth-right-section">
				<div className="w-full h-full z-10 relative lg:mt-4 lg:mb-16">
					<blockquote className="auth-blockquote">
						Stratos is a next-gen stock signals platform that helps you make
						informed decisions based on real-time market data.
					</blockquote>

					<div className="flex justify-between items-center">
						<div>
							<cite className="text-sm md:text-lg font-bold text-gray-400 not-italic">
								-Ethan R.
							</cite>
							<p className="max-md:text-xs text-gray-500 mb-2">Retail Trader</p>
							<div className="flex items-center gap-0.5">
								{[1, 2, 3, 4, 5].map((star) => {
									return (
										<Image
											src={"/assets/icons/star.svg"}
											alt="Star"
											width={20}
											height={20}
											key={star}
											className="w-5 h-5"
										/>
									);
								})}
							</div>
						</div>
					</div>
				</div>

				<div className="flex-1 relative ">
					<Image
						src={"/assets/images/dashboard.png"}
						alt="Dashboard"
						height={1150}
						width={1440}
						className="hidden lg:block border-gray-800 border-6 h-auto max-w-none w-[1024px] rounded-xl shadow-2xl"
					/>
				</div>
			</section>
		</main>
	);
};

export default Layout;
