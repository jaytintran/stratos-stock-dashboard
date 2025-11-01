import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "./templates";

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
