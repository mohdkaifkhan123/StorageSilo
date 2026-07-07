import { StatusCodes } from "http-status-codes";
import { UserServices } from "../services/index.js";
import { CustomSuccess } from "../utils/SuccessHandling.js";

export const logoutUser = async (req, res, next) => {
  try {
    const token = req.signedCookies.token;
    await UserServices.LogoutService(token);
    res.clearCookie("token");
    return CustomSuccess(res, StatusCodes.NO_CONTENT, null);
  } catch (error) {
    next(error);
  }
};
