import { Admin } from "../entities/admin.entity.js";
import { AppDataSource } from "../libs/data-source.js";
import env from "../libs/env.js";
import logger from "../libs/logger.js";
import { encrypt } from "../libs/utils/auth.js";

const seedAdmin = async () => {
  try {
    const adminRepository = AppDataSource.getRepository(Admin);

    const existingAdmin = await adminRepository.findOneBy({
      username: env.ADMIN_USERNAME,
    });

    if (existingAdmin) return;

    const admin = new Admin();
    admin.username = env.ADMIN_USERNAME;
    admin.password = await encrypt(env.ADMIN_PASSWORD);
    await adminRepository.save(admin);

    logger.info({ message: "Admin Data Seeded!" });
  } catch (error) {
    if (error instanceof Error) {
      logger.error({ message: error.message });
    }
  }
};

export default seedAdmin;
