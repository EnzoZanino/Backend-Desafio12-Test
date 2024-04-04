import passport from "passport";
import passportLocal from "passport-local";
import jwtStrategy from "passport-jwt";
import userModel from "../services/dao/models/user.model.js";
import { createHash } from "../utils/bcrypt.js";
import config from "./config.js";
import logger from "../utils/logger.js";

const privateKey = config.privateKey;

//Local Strategy
const localStrategy = passportLocal.Strategy;

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {
	//JWTStrategy with Cookie
	passport.use(
		"jwt",
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
				secretOrKey: privateKey,
			},
			async (jwt_payload, done) => {
				try {
					return done(null, jwt_payload.user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);
	//Passport Local
	//Register
	passport.use(
		"register",
		new localStrategy(
			{ passReqToCallback: true, usernameField: "email" },
			async (req, username, password, done) => {
				const { first_name, last_name, email, age } = req.body;
				try {
					//User in DB validation
					const user = await userModel.findOne({ email });
					if (user) {
						logger.info("User registered with provided email: " + email);
						done(null, false);
					}
					//Admin role validation
					let role;
					if (email === config.adminEmail) {
						role = "admin";
					}
					const newUser = {
						first_name,
						last_name,
						email,
						age,
						password: createHash(password),
						loggedBy: "App",
						role,
					};
					const result = await userModel.create(newUser);
					logger.info(`User registered locally with email: ${newUser.email}`);
					return done(null, result);
				} catch (error) {
					return done("Error registering user: " + error);
				}
			}
		)
	);

	//Serialize function
	passport.serializeUser((user, done) => {
		done(null, user._id);
	});
	//Deserialize function
	passport.deserializeUser(async (id, done) => {
		try {
			let user = await userModel.findById(id);
			done(null, user);
		} catch (error) {
			logger.error("Error deserializing user: " + error);
		}
	});
};

//CookieExtractor function
const cookieExtractor = (req) => {
	let token = null;
	if (req && req.cookies) {
		//Request and cookies validation
		token = req.cookies["jwtCookieToken"];
	}
	return token;
};

export default initializePassport;
