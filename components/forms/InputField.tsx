import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const InputField = ({
	name,
	label,
	placeholder,
	type = "text",
	register,
	error,
	validation,
	disabled,
	value,
}: FormInputProps) => {
	return (
		<div className="space-y-2 lg:mb-4 mb-2">
			<Label htmlFor={name} className="form-label">
				{label}
			</Label>

			<Input
				id={name}
				name={name}
				type={type}
				placeholder={placeholder}
				disabled={disabled}
				value={value}
				className={cn("form-input", {
					"opacity=50 cursor-not-allowed": disabled,
				})}
				{...register(name, validation)}
			/>
			{error && <span className="text-red-500 text-sm">{error.message}</span>}
		</div>
	);
};

export default InputField;
