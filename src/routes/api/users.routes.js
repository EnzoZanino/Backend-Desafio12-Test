import { Router } from "express";
import {
  getUsersController,
  getUserController,
  deleteUserController,
  changeUserRoleController,
  resetPasswordEmailController,
  updatePasswordController,
} from "../../controllers/usersControllers.js";
import { authorization } from "../../utils/auth.js";
import { passportCall } from "../../utils/passport.js";

const router = Router();

router.get(
  "/",
  passportCall("jwt"),
  authorization("admin"),
  getUsersController
);

router.get(
  "/:userId",
  passportCall("jwt"),
  authorization("admin"),
  getUserController
);

router.delete(
  "/:userId",
  passportCall("jwt"),
  authorization("admin"),
  deleteUserController
);

router.put(
  "/premium/:uid",
  passportCall("jwt"),
  authorization("admin"),
  changeUserRoleController
);

router.put("/recoverpassword", resetPasswordEmailController);

router.put("/updatepassword", updatePasswordController);

export default router;
