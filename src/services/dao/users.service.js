import userModel from "./models/user.model.js";
import logger from "../../utils/logger.js";

export default class UserService {
  async getAllUsers() {
    try {
      const users = await userModel.find();
      return users;
    } catch (error) {
      logger.error("Error consulting users");
    }
  }

  async getUser(userId) {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return { message: "User not found with ID: " + userId };
      }
      return user;
    } catch (error) {
      logger.error("Error consulting user with ID: " + userId);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await userModel.findOne({ email: email });
      return user;
    } catch (error) {
      logger.error("Error consulting user with email: " + email);
    }
  }

  async updateUser(uid, data) {
    try {
      return await userModel.findByIdAndUpdate(uid, data);
    } catch (error) {
      logger.error("Error updating user with Id: " + uid);
    }
  }

  async deleteUser(userId) {
    try {
      const user = await userModel.findByIdAndDelete(userId);
      if (!user) {
        return { message: "User not found with ID: " + userId };
      }
      return { message: "User deleted" };
    } catch (error) {
      logger.error("Error deleting user with ID: " + userId);
    }
  }
  async changeUserRole(userId) {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return { message: "User not found with ID: " + userId };
      }
      user.role = user.role === "user" ? "premium" : "user";

      await user.save();

      return { message: "User role changed successfully" };
    } catch (error) {
      logger.error("Error changing user role with ID: " + userId);
    }
  }
}
