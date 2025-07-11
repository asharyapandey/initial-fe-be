import bcrypt from "bcryptjs";

import env from "../env.js";

export const encrypt = (password: string) => {
  return bcrypt.hash(password, env.SALT);
};

export const compare = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
