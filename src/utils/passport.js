import config from "../config/config.js";
import jwt from "jsonwebtoken";
import passport from "passport";

const privateKey = config.privateKey;
const resetPasswordKey = config.resetPasswordKey;

//JSON Web Tokens JWT functinos:
export const generateJWToken = (user) => {
  return jwt.sign({ user }, privateKey, { expiresIn: "1d" });
};

export const generateTokenResetPassword = (user) => {
  return jwt.sign({ user }, resetPasswordKey, { expiresIn: "1h" });
};

export const authToken = (req, res, next) => {
  //Saving JWT in authorization headers
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .send({ error: "User not authenticated or missing token." });
  }
  const token = authHeader.split(" ")[1];
  //Token validation
  jwt.verify(token, privateKey, (error, credentials) => {
    if (error)
      return res.status(403).send({ error: "Token invalid, Unauthorized!" });
    //Token OK
    req.user = credentials.user;
    next();
  });
};

export const authTokenResetPassword = (req, res, next) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).json({ error: "Token not provided" });
  }
  jwt.verify(token, resetPasswordKey, (error, credentials) => {
    if (error) return res.render("changePasswordEmail");
    req.user = credentials.user;
    next();
  });
};

export const decodeJWT = (token, signature) => {
  const payload = jwt.verify(token, signature);
  return payload;
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() });
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};
