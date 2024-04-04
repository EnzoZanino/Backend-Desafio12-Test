import bcrypt from "bcryptjs";

//Bcrypt create/validate Hash functions
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};
