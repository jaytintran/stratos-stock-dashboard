"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import countryList from "react-select-country-list";
import ReactCountryFlag from "react-country-flag";

const CountrySelect = ({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) => {
	// Get countries with its flag code
	const countries = countryList().getData();
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="country-select-wrapper w-full flex items-center justify-between gap-2"
				>
					{value ? (
						<div className="gap-3 flex items-center">
							<ReactCountryFlag countryCode={value} />
							<span>{countries.find((c) => c.value === value)?.label}</span>
						</div>
					) : (
						<p>Select Your Country</p>
					)}
					<ChevronDown className="ml-2 h-4 w-4 opacity-50" />
				</Button>
			</PopoverTrigger>

			<PopoverContent
				className="w-full p-0 bg-gray-800 border-gray-600"
				align="start"
			>
				<Command>
					<CommandInput
						placeholder="Search country..."
						className="h-9 border-0 focus:ring-0"
					/>
					<CommandList className="max-h-60 overflow-y-auto scrollbar-hidden">
						<CommandEmpty>No country found.</CommandEmpty>
						<CommandGroup>
							{countries.map((country) => (
								<CommandItem
									key={country.value}
									value={`${country.label} ${country.value}`}
									onSelect={() => {
										onChange(country.value);
										setOpen(false);
									}}
									className="text-white hover:bg-gray-600"
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === country.value ? "opacity-100" : "opacity-0"
										)}
									/>
									{country.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

const CountrySelectField = ({
	name,
	label,
	control,
	error,
	required = false,
}: CountrySelectFieldProps) => {
	return (
		<div className="space-y-2 lg:mb-4 mb-2">
			<Label htmlFor="country" className="form-label">
				Country
			</Label>

			<Controller
				name={name}
				control={control}
				rules={{
					required: required ? `Please select ${label.toLowerCase}` : false,
				}}
				render={({ field }) => (
					<CountrySelect value={field.value} onChange={field.onChange} />
				)}
			/>
			{error && <p className="text-sm text-red-500">{error.message}</p>}
			<p className="text-xs text-gray-500">
				Helps us show market data and news relevant to you.
			</p>
		</div>
	);
};

export default CountrySelectField;
