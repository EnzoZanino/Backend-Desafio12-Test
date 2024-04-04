import { Router } from "express";
import passport from "passport";
import { login, logout, register } from "../../controllers/jwtControllers.js";

const router = Router();

//Register
router.post(
	"/register",
	passport.authenticate("register", { session: false }),
	register
);

//Login
router.post("/login", login);

//Logout
router.post("/logout", logout);

export default router;
