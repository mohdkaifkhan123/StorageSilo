import { createRedisSession } from "./createRedisSession.js";
import { isCredentialsValid } from "./isCredentialsValid.js";

export const loginService = async (data) => {
  try {
    const { email, password } = data;

    const user = await isCredentialsValid(email, password);
    const sessionInfo = await createRedisSession(user.id);
    console.log("uststfs",user)
    return {
      user,
      ...sessionInfo,
    };
  } catch (error) {
    throw error;
  }
};

const AuthServices = {
  LoginService: loginService,
};

export default AuthServices;
