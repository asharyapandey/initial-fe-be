import { ILike, Raw } from "typeorm";
import { Candidate } from "../entities/candidate.entity.js";
import { CV } from "../entities/cv.entity.js";
import { VacancyCandidate } from "../entities/vacancy-candidate.entity.js";
import { VacancyMedium } from "../entities/vacancy-medium.entity.js";
import { AppDataSource } from "../libs/data-source.js";
import { getLimitOffset, getPaginatedResult, } from "../libs/utils/pagination.js";
const candidateRepository = AppDataSource.getRepository(Candidate);
const vacancyMediumRepository = AppDataSource.getRepository(VacancyMedium);
async function listPaginated(params) {
    const { page, pageSize, keyword } = params;
    const trimmedkey = keyword.trim().replace(/\s+/g, "");
    const paginationQueries = getLimitOffset({ page, pageSize });
    const [result, count] = await candidateRepository.findAndCount({
        ...paginationQueries,
        where: [
            { email: ILike(`%${keyword}%`) },
            {
                firstName: Raw(() => `CONCAT(
            first_name,
            middle_name,
            last_name
          ) like :fullName`, { fullName: `%${trimmedkey}%` }),
            },
        ],
        order: {
            deletedAt: "ASC",
            createdAt: "DESC",
        },
        withDeleted: true,
    });
    const paginatedResult = getPaginatedResult({ count, page, pageSize, result });
    return { paginatedResult };
}
async function findByEmail(email) {
    const emailExists = await candidateRepository.findOne({
        where: { email: email },
    });
    return emailExists;
}
async function listByEmail(email) {
    const searchResult = await candidateRepository.find({
        take: 5,
        where: { email: ILike(`%${email}%`) },
    });
    return searchResult;
}
async function findByPhone(phone) {
    const phoneExists = await candidateRepository.findOne({
        where: { phone },
    });
    return phoneExists;
}
async function findVacancyMedium(vacancyId, mediumId) {
    const vacancyMedium = await vacancyMediumRepository.findOne({
        where: { vacancy: { id: vacancyId }, medium: { id: mediumId } },
    });
    return vacancyMedium;
}
async function create({ firstName, middleName, lastName, email, phone, address, gender, mediumId, vacancyId, shortlistId, cv, }) {
    return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
        const candidate = candidateRepository.create({
            firstName,
            middleName,
            lastName,
            email,
            phone,
            address,
            gender,
        });
        await transactionalEntityManager.save(candidate);
        const vacancyCandidate = transactionalEntityManager.create(VacancyCandidate, {
            vacancy: { id: vacancyId },
            shortlist: { id: shortlistId },
            medium: { id: mediumId },
            candidate,
        });
        await transactionalEntityManager.save(vacancyCandidate);
        if (cv) {
            const addCV = transactionalEntityManager.create(CV, {
                minioFileName: cv.minioFileName,
                fileName: cv.fileName,
                recievedAt: cv.recievedAt,
                candidate,
            });
            await transactionalEntityManager.save(addCV);
        }
        return candidate;
    });
}
async function update(id, candidateData) {
    return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
        const candidate = await transactionalEntityManager.findOne(Candidate, {
            where: { id },
        });
        if (!candidate) {
            throw new Error(JSON.stringify({
                code: "invalidCandidate",
                message: `Candidate with id ${id} does not exist.`,
            }));
        }
        candidateRepository.merge(candidate, candidateData);
        await transactionalEntityManager.save(candidate);
        const existingVacancyCandidate = await transactionalEntityManager.findOne(VacancyCandidate, {
            where: {
                vacancy: { id: candidateData.vacancyId },
                candidate: { id: id },
            },
        });
        if (existingVacancyCandidate) {
            throw new Error(JSON.stringify({
                code: "candidateExists",
                message: "Candidate already exists in vacancy",
            }));
        }
        const vacancyCandidate = transactionalEntityManager.create(VacancyCandidate, {
            vacancy: { id: candidateData.vacancyId },
            shortlist: { id: candidateData.shortlistId },
            medium: { id: candidateData.mediumId },
            candidate,
        });
        await transactionalEntityManager.save(vacancyCandidate);
        if (candidateData.cv) {
            const addCV = transactionalEntityManager.create(CV, {
                minioFileName: candidateData.cv.minioFileName,
                fileName: candidateData.cv.fileName,
                receivedAt: candidateData.cv.receivedAt,
                candidate,
            });
            await transactionalEntityManager.save(addCV);
        }
        return candidate;
    });
}
async function remove() { }
async function findById(candidateId) {
    const candidate = await candidateRepository.findOne({
        where: {
            id: candidateId,
        },
        relations: [
            "vacancyCandidates",
            "vacancyCandidates.vacancy.designation",
            "cvs",
        ],
        withDeleted: true,
    });
    return candidate;
}
export const candidateService = {
    create,
    findByEmail,
    findByPhone,
    listByEmail,
    update,
    remove,
    listPaginated,
    findVacancyMedium,
    findById,
};
//# sourceMappingURL=candidate.service.js.map