import { ILike, In, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { Designation } from "../entities/designation.entity.js";
import { Vacancy } from "../entities/vacancy.entity.js";
import { VacancyCandidate } from "../entities/vacancy-candidate.entity.js";
import { VacancyMedium } from "../entities/vacancy-medium.entity.js";
import { AppDataSource } from "../libs/data-source.js";
import { getLimitOffset, getPaginatedResult, } from "../libs/utils/pagination.js";
import { mediumService } from "./medium.service.js";
const vacancyRepository = AppDataSource.getRepository(Vacancy);
const vacancyCandidateRepository = AppDataSource.getRepository(VacancyCandidate);
async function create({ description, designationId, openingDate, closingDate, referenceNo, noOfOpenings, mediums, }) {
    return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
        const vacancy = vacancyRepository.create({
            description,
            designation: { id: designationId },
            openingDate,
            closingDate,
            referenceNo,
            noOfOpenings,
        });
        await transactionalEntityManager.save(vacancy);
        for (const medium of mediums) {
            const { mediumId, mediumURL } = medium;
            const mediumExists = await mediumService.find(mediumId, false);
            if (!mediumExists) {
                throw new Error(`medium with id ${mediumId} does not exist`);
            }
            const vacancyMedium = transactionalEntityManager.create(VacancyMedium, {
                medium: mediumExists,
                mediumURL,
                vacancy,
            });
            await transactionalEntityManager.save(vacancyMedium);
        }
        return vacancy;
    });
}
async function generateReference({ openingDate, designationCode, }) {
    const date = new Date(openingDate);
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    let referenceNo = `${month}-${year}-${designationCode}`;
    const [, count] = await vacancyRepository.findAndCount({
        where: {
            referenceNo: ILike(`${referenceNo}%`),
        },
        withDeleted: true,
    });
    if (count) {
        referenceNo = referenceNo + `-${count}`;
    }
    return referenceNo;
}
async function listPaginated(pagination, designations, referenceNo, openingDate, closingDate) {
    const paginationQueries = getLimitOffset(pagination);
    const [result, count] = await vacancyRepository.findAndCount({
        ...paginationQueries,
        where: {
            ...(designations ? { designation: { id: In(designations) } } : null),
            ...(referenceNo ? { referenceNo: ILike(`%${referenceNo}%`) } : null),
            ...(openingDate && closingDate
                ? {
                    openingDate: MoreThanOrEqual(openingDate),
                    closingDate: LessThanOrEqual(closingDate),
                }
                : null),
        },
        relations: ["designation", "vacancyMediums.medium"],
        order: {
            deletedAt: "ASC",
        },
        withDeleted: true,
    });
    const paginatedResult = getPaginatedResult({
        count,
        page: pagination.page,
        pageSize: pagination.pageSize,
        result,
    });
    return { paginatedResult };
}
async function find(id, withDeleted = true) {
    const vacancy = await vacancyRepository.findOne({
        where: { id: id },
        withDeleted: withDeleted,
    });
    return vacancy;
}
async function findVacancy(id, withDeleted = true) {
    const vacancy = await vacancyRepository.findOne({
        where: { id },
        withDeleted: withDeleted,
        relations: ["designation"],
    });
    return vacancy;
}
async function details(vacancyId) {
    const vacancy = await vacancyRepository.findOne({
        where: { id: vacancyId },
        relations: [
            "vacancyMediums.medium",
            "shortlists.vacancyCandidates",
            "designation",
        ],
        withDeleted: true,
    });
    return vacancy;
}
async function disable(id) {
    await vacancyRepository.softDelete(id);
}
async function enable(vacancy) {
    const recoveredVacancy = vacancyRepository.merge(vacancy, {
        deletedAt: null,
    });
    await vacancyRepository.save(recoveredVacancy);
    return recoveredVacancy;
}
async function update(vacancy, values) {
    return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
        const designation = await transactionalEntityManager.findOne(Designation, {
            where: { id: values.designationId },
        });
        const newVacancy = vacancyRepository.merge(vacancy, values);
        newVacancy.designation = designation;
        await transactionalEntityManager.save(newVacancy);
        const existingVacancyMediums = await transactionalEntityManager.find(VacancyMedium, {
            where: { vacancy: { id: vacancy.id } },
            relations: ["medium"],
        });
        const newMediumIds = values.mediums.map((m) => m.mediumId);
        const mediumsToRemove = existingVacancyMediums.filter((vm) => {
            return vm.medium && !newMediumIds.includes(vm.medium.id);
        });
        await transactionalEntityManager.remove(VacancyMedium, mediumsToRemove);
        for (const medium of values.mediums) {
            const existingMedium = existingVacancyMediums.find((vm) => {
                return vm.medium && vm.medium.id === medium.mediumId;
            });
            if (existingMedium) {
                if (existingMedium.mediumURL !== medium.mediumURL) {
                    existingMedium.mediumURL = medium.mediumURL;
                    await transactionalEntityManager.save(existingMedium);
                }
            }
            else {
                const mediumExists = await mediumService.find(medium.mediumId, false);
                if (!mediumExists) {
                    throw new Error(`Medium with id ${medium.mediumId} does not exist`);
                }
                const newVacancyMedium = transactionalEntityManager.create(VacancyMedium, {
                    medium: mediumExists,
                    mediumURL: medium.mediumURL,
                    vacancy: newVacancy,
                });
                await transactionalEntityManager.save(newVacancyMedium);
            }
        }
        return newVacancy;
    });
}
async function findCandidate({ vacancyId, candidateId, }) {
    const vacancyCandidate = await vacancyCandidateRepository.findOne({
        where: {
            vacancy: {
                id: vacancyId,
            },
            candidate: {
                id: candidateId,
            },
        },
        relations: ["status", "candidate"],
    });
    return vacancyCandidate;
}
async function updateStatus({ vacancyCandidate, values, }) {
    const updatedVacancyCandidate = vacancyCandidateRepository.merge(vacancyCandidate, {
        status: { id: values.statusId },
        remarks: values.remarks,
    });
    await vacancyCandidateRepository.save(updatedVacancyCandidate);
    return updatedVacancyCandidate;
}
export const vacancyService = {
    listPaginated,
    create,
    generateReference,
    find,
    enable,
    disable,
    details,
    update,
    findVacancy,
    findCandidate,
    updateStatus,
};
//# sourceMappingURL=vacancy.service.js.map