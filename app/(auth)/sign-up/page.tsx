"use client";

import CountrySelectField from "@/components/forms/CountrySelectField";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { Button } from "@/components/ui/button";
import {
	INVESTMENT_GOALS,
	PREFERRED_INDUSTRIES,
	RISK_TOLERANCE_OPTIONS,
} from "@/lib/constants";
import { useForm, SubmitHandler } from "react-hook-form";

const SignUp = () => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<SignUpFormData>({
		mode: "onBlur",
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
			country: "US",
			investmentGoals: "Growth",
			riskTolerance: "Medium",
			preferredIndustries: "Technology",
		},
	});
	const onSubmit = async (data: SignUpFormData) => {
		try {
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<h1 className="text-4xl font-bold text-gray-200 not-italic">
				Sign Up & Personalize
			</h1>

			<form onSubmit={handleSubmit(onSubmit)} className="my-10">
				<InputField
					name="fullName"
					label="Full Name"
					placeholder="John Doe"
					register={register}
					error={errors.fullName}
					validation={{ required: "Full name is required", minLength: 3 }}
				/>
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

				<CountrySelectField
					name="country"
					label="Country"
					control={control}
					error={errors.country}
					required
				/>

				<SelectField
					name="investmentGoals"
					label="Investment Goals"
					placeholder="Select Investment Goals"
					options={INVESTMENT_GOALS}
					control={control}
					error={errors.investmentGoals}
					required
				/>
				<SelectField
					name="riskTolerance"
					label="Risk Tolerance"
					placeholder="Select Your Risk Level"
					options={RISK_TOLERANCE_OPTIONS}
					control={control}
					error={errors.riskTolerance}
					required
				/>
				<SelectField
					name="preferredIndustries"
					label="Preferred Industries"
					placeholder="Select Your Preferred Industries"
					options={PREFERRED_INDUSTRIES}
					control={control}
					error={errors.preferredIndustries}
					required
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
					{isSubmitting
						? "Creating Account..."
						: "Start Your Investing Journey"}
				</Button>
			</form>
		</>
	);
};

export default SignUp;
