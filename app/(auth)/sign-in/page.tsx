"use client";

import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/actions/auth.actions";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignIn = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInFormData>({
		mode: "onBlur",
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const onSubmit = async (data: SignInFormData) => {
		try {
			const result = await signIn(data);

			if (result?.success === false) {
				// Sign in failed - show error toast
				toast.error("Sign in failed", {
					description:
						(result.message && "Email or password is incorrect") ||
						"Failed to sign in",
				});
			} else {
				// Sign in was successful (no error returned)
				router.push("/");
			}
		} catch (error) {
			console.error(error);
			toast.error("Sign in failed", {
				description: "An unexpected error occurred",
			});
		}
	};

	return (
		<div>
			<h1 className="text-2xl font-bold text-gray-200 not-italic mb-5">
				Welcome Back
			</h1>

			<form onSubmit={handleSubmit(onSubmit)} className="my-10">
				<InputField
					name="email"
					label="Email"
					placeholder="johndoe@gmail.com"
					register={register}
					error={errors.email}
					validation={{
						required: "Email is required",
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: "Invalid email address",
						},
					}}
				/>

				<InputField
					name="password"
					label="Password"
					placeholder="Password"
					type="password"
					register={register}
					error={errors.password}
					validation={{ required: "Password is required", minLength: 6 }}
				/>

				<Button
					type="submit"
					disabled={isSubmitting}
					className="yellow-btn w-full mt-5 !py-2"
					size="lg"
				>
					{isSubmitting ? "Signing in..." : "Sign In"}
				</Button>

				<FooterLink
					text="Don't have an account?"
					linkText="Sign Up"
					href="/sign-up"
				/>
			</form>
		</div>
	);
};

export default SignIn;
