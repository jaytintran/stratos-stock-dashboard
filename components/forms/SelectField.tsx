import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

const SelectField = ({
	name,
	label,
	placeholder,
	options,
	control,
	error,
	required = false,
}: SelectFieldProps) => {
	return (
		<div className="space-y-2 lg:mb-4 mb-2">
			<Label htmlFor={name} className="form-label">
				{label}
			</Label>
			<Controller
				name={name}
				control={control}
				rules={{
					required: required ? `Please select ${label.toLowerCase}` : false,
				}}
				render={({ field }) => (
					<Select value={field.value} onValueChange={field.onChange}>
						<SelectTrigger className="w-[180px] select-trigger">
							<SelectValue placeholder={placeholder} />
						</SelectTrigger>
						<SelectContent className="bg-gray-800 border-gray-600 text-white">
							{options.map((option) => (
								<SelectItem
									key={option.value}
									value={option.value}
									className="focus:bg-gray-600 focus:text-white"
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			/>
			{error && <span className="text-red-500 text-sm">{error.message}</span>}
		</div>
	);
};

export default SelectField;
