import { Designation } from "../entities/designation.entity.js";
import { AppDataSource } from "../libs/data-source.js";
import { getLimitOffset, getPaginatedResult, } from "../libs/utils/pagination.js";
const designationRepository = AppDataSource.getRepository(Designation);
async function listPaginated({ pageSize, page }) {
    const paginationQueries = getLimitOffset({ page, pageSize });
    const [result, count] = await designationRepository.findAndCount({
        ...paginationQueries,
        order: {
            deletedAt: "ASC",
            createdAt: "DESC",
        },
        withDeleted: true,
    });
    const paginatedResult = getPaginatedResult({ count, page, pageSize, result });
    return { paginatedResult };
}
async function find(designationId, withDeleted = true) {
    const designation = await designationRepository.findOne({
        where: { id: designationId },
        withDeleted: withDeleted,
    });
    return designation;
}
async function update(designation, values) {
    const updatedDesignation = designationRepository.merge(designation, values);
    await designationRepository.save(updatedDesignation);
    return updatedDesignation;
}
export const create = async (name, color, code) => {
    const designation = designationRepository.create({ name, color, code });
    await designationRepository.save(designation);
    return designation;
};
async function disable(id) {
    await designationRepository.softDelete(id);
}
async function enable(designation) {
    const recoveredDesignation = designationRepository.merge(designation, {
        deletedAt: null,
    });
    await designationRepository.save(recoveredDesignation);
}
async function list() {
    const designations = await designationRepository.find({
        select: { id: true, name: true },
    });
    return designations;
}
async function findByName(name) {
    const designation = await designationRepository.findOne({
        where: { name },
        withDeleted: true,
    });
    return designation;
}
async function findByColor(color) {
    const designation = await designationRepository.findOne({
        where: { color },
        withDeleted: true,
    });
    return designation;
}
async function findByCode(code) {
    const designation = await designationRepository.findOne({
        where: { code },
        withDeleted: true,
    });
    return designation;
}
export const designationService = {
    listPaginated,
    find,
    findByName,
    findByColor,
    findByCode,
    create,
    disable,
    enable,
    update,
    list,
};
//# sourceMappingURL=designation.service.js.map