import Header from "@/components/Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className="min-h-screen text-gray-400">
			{/* HEADER */}
			<Header />
			<div className="container py-10 mx-auto">{children}</div>
		</main>
	);
};

export default Layout;
