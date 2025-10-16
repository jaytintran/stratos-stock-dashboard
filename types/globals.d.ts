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
		options: { value: string; label: string }[];
		error?: FieldError;
		control: Control;
		required?: boolean;
	};

	type CountrySelectFieldProps = {
		name: string;
		label: string;
		control: Control;
		error?: FieldError;
		required?: boolean;
	};

	type FooterLinkProps = {
		text: string;
		linkText: string;
		href: string;
	};
}

declare module "*.css" {
	const content: Record<string, string>;
	export default content;
}

export {};
