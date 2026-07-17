import bcrypt from "bcrypt";
import prisma from "../../prisma/prismaClient.js";
import { CreateError } from "../../utils/ErrorHandling.js";

export const isCredentialsValid = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw CreateError("Invalid credentials", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw CreateError("Invalid credentials", 401);
  }
  return user;
};
