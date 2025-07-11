import { Medium } from "../entities/medium.entity.js";
import { AppDataSource } from "../libs/data-source.js";
import { getLimitOffset, getPaginatedResult, } from "../libs/utils/pagination.js";
const mediumRepository = AppDataSource.getRepository(Medium);
async function create(name) {
    const medium = mediumRepository.create({ name });
    await mediumRepository.save(medium);
    return { medium };
}
async function findByName(name) {
    const mediumName = await mediumRepository.findOne({
        where: {
            name,
        },
        withDeleted: true,
    });
    return mediumName;
}
async function update(medium, values) {
    const newMedium = mediumRepository.merge(medium, values);
    await mediumRepository.save(newMedium);
    return newMedium;
}
async function listPaginated({ pageSize, page }) {
    const paginationQueries = getLimitOffset({ page, pageSize });
    const [result, count] = await mediumRepository.findAndCount({
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
    const medium = await mediumRepository.findOne({
        where: { id },
        withDeleted: withDeleted,
    });
    return medium;
}
async function list() {
    const mediums = await mediumRepository.find();
    return mediums;
}
async function disable(id) {
    await mediumRepository.softDelete(id);
}
async function enable(medium) {
    const recoveredMedium = mediumRepository.merge(medium, {
        deletedAt: null,
    });
    await mediumRepository.save(recoveredMedium);
}
export const mediumService = {
    create,
    update,
    listPaginated,
    find,
    list,
    disable,
    enable,
    findByName,
};
//# sourceMappingURL=medium.service.js.map