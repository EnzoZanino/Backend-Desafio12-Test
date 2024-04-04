import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();

program
	.option("-d", "Debug variable", false)
	.option("-p <port>", "Server Port", 9090)
	.option("--mode <mode>", "Work mode", "dev");
program.parse();

const enviroment = program.opts().mode;

dotenv.config({
	path:
		enviroment === "prod"
			? "./src/config/.env.production"
			: "./src/config/.env.development",
});

export default {
	port: process.env.PORT,
	mongoUrl: process.env.MONGO_URL,
	enviroment: program.opts().mode,
	privateKey: process.env.PRIVATE_KEY,
	gmailAccount: process.env.GMAIL_ACCOUNT,
	gmailAppPassword: process.env.GMAIL_APP_PASSWD,
	resetPasswordKey: process.env.RESET_PASSWORD_KEY,
	adminEmail: process.env.ADMIN_EMAIL,
};
