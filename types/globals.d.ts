import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

declare global {
	interface SignUpFormData {
		fullName: string;
		email: string;
		password: string;
		country: string;
		investmentGoals: string;
		riskTolerance: string;
		preferredIndustries: string;
	}

	interface SignInFormData {
		email: string;
		password: string;
	}

	interface WelcomeEmailData {
		email: string;
		name: string;
		info: string;
	}

	interface FormInputProps {
		name: string;
		label: string;
		placeholder: string;
		type?: string;
		register: UseFormRegister;
		error?: FieldError;
		validation?: RegisterOptions;
		disabled?: boolean;
		value?: string;
	}

	type SelectFieldProps = {
		name: string;
		label: string;
		placeholder: string;
	};
}

declare module "*.css" {
	const content: Record<string, string>;
	export default content;
}

export {};
