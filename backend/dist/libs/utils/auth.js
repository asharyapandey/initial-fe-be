import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../env.js";
export const encrypt = (password) => {
    return bcrypt.hash(password, env.SALT);
};
export const compare = (password, hash) => {
    return bcrypt.compare(password, hash);
};
export const generateToken = (userId) => {
    return jwt.sign({ id: userId }, env.JWT_SECRET, {
        expiresIn: env.TOKEN_EXPIRATION,
    });
};
//# sourceMappingURL=auth.js.map