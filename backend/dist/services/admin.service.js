import { Admin } from "../entities/admin.entity.js";
import { AppDataSource } from "../libs/data-source.js";
import { compare } from "../libs/utils/auth.js";
const adminRepository = AppDataSource.getRepository(Admin);
export async function authenticateAdmin(username, password) {
    const admin = await adminRepository.findOne({ where: { username } });
    if (!admin) {
        throw new Error("Admin not found");
    }
    const isMatch = await compare(password, admin.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    return admin;
}
//# sourceMappingURL=admin.service.js.map