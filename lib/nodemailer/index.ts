import nodemailer from "nodemailer";
import {
	NEWS_SUMMARY_EMAIL_TEMPLATE,
	WELCOME_EMAIL_TEMPLATE,
} from "./templates";

export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER!,
		pass: process.env.EMAIL_PASSWORD!,
	},
});

export const sendWelcomeEmail = async ({
	email,
	name,
	intro,
}: WelcomeEmailData) => {
	const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace(
		"{{intro}}",
		intro
	);

	const mailOptions = {
		from: "Signalist <no-reply@signalist.ai>",
		to: email,
		subject: "Welcome to Signalist",
		html: htmlTemplate,
	};

	await transporter.sendMail(mailOptions);
};

export const sendNewsSummaryEmail = async ({
	email,
	date,
	newsContent,
}: {
	email: string;
	date: string;
	newsContent: string;
}): Promise<void> => {
	const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE.replace(
		"{{newsContent}}",
		newsContent
	).replace("{{date}}", date);

	const mailOptions = {
		from: "Stratos News <jaytintran@gmail.com>",
		to: email,
		subject: `Market News Today - ${date}`,
		text: `Market News Today From Stratos- ${date}`,
		html: htmlTemplate,
	};

	await transporter.sendMail(mailOptions);
};
