import userModel from "../services/dao/models/user.model.js";
import { isValidPassword } from "../utils/bcrypt.js";
import { generateJWToken } from "../utils/passport.js";
import logger from "../utils/logger.js";

export const register = async (req, res) => {
	logger.info("Registering user");
	res.status(201).send({ status: "success", message: "Success creating user" });
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await userModel.findOne({ email: email });
		if (!user) {
			logger.error("No user with provided email: " + email);
			return res.status(204).send({
				error: "Not found",
				message: "No user found with provided email: " + email,
			});
		}
		if (!isValidPassword(user, password)) {
			logger.error("Invalid credentials");
			return res.status(401).send({
				status: "error",
				error: "Invalid credentials",
			});
		}
		const tokenUser = {
			name: `${user.first_name} ${user.last_name}`,
			email: user.email,
			age: user.age,
			role: user.role,
			id: user._id,
		};
		const access_token = generateJWToken(tokenUser);
		res.cookie("jwtCookieToken", access_token, {
			maxAge: 600000,
			httpOnly: true,
		});
		res.redirect("/products");
	} catch (error) {
		logger.error(error);
		return res.status(500).send({ status: "error", error: "Intern app error" });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("jwtCookieToken");
	res.redirect("/login");
};
