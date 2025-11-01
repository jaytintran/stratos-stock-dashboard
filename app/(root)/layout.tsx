import Header from "@/components/Header";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	const user = {
		id: session.user.id,
		name: session.user.name,
		email: session.user.email,
	};

	return (
		<main className="min-h-screen text-gray-400">
			{/* HEADER */}
			<Header user={user} />
			<div className="container py-10 mx-auto">{children}</div>
		</main>
	);
};

export default Layout;
