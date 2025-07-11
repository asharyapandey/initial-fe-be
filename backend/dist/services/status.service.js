import { Status } from "../entities/status.entity.js";
import { AppDataSource } from "../libs/data-source.js";
import { getLimitOffset, getPaginatedResult, } from "../libs/utils/pagination.js";
const statusRepository = AppDataSource.getRepository(Status);
// create status service
async function create(name, color) {
    const status = statusRepository.create({ name, color });
    await statusRepository.save(status);
    return status;
}
async function findByName(name) {
    const statusName = await statusRepository.findOne({
        where: {
            name,
        },
        withDeleted: true,
    });
    return statusName;
}
async function findByColor(color) {
    const statusColor = await statusRepository.findOne({
        where: {
            color,
        },
        withDeleted: true,
    });
    return statusColor;
}
async function update(status, values) {
    const newStatus = statusRepository.merge(status, values);
    await statusRepository.save(newStatus);
    return newStatus;
}
async function listPaginated({ page, pageSize }) {
    const paginationQueries = getLimitOffset({ page, pageSize });
    const [result, count] = await statusRepository.findAndCount({
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
async function find(id, withDeleted = true) {
    const status = await statusRepository.findOne({
        where: { id: id },
        withDeleted: withDeleted,
    });
    return status;
}
async function list() {
    const mediums = await statusRepository.find();
    return mediums;
}
async function disable(id) {
    await statusRepository.softDelete(id);
}
async function enable(status) {
    const recoveredStatus = statusRepository.merge(status, {
        deletedAt: null,
    });
    await statusRepository.save(recoveredStatus);
}
export const statusService = {
    create,
    update,
    listPaginated,
    find,
    disable,
    enable,
    findByName,
    list,
    findByColor,
};
//# sourceMappingURL=status.service.js.map