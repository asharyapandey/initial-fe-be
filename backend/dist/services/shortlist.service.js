import { Shortlist } from "../entities/shortlist.entity.js";
import { Vacancy } from "../entities/vacancy.entity.js";
import { AppDataSource } from "../libs/data-source.js";
const shortlistRepository = AppDataSource.getRepository(Shortlist);
const vacancyRepository = AppDataSource.getRepository(Vacancy);
async function create(name, vacancyId) {
    const vacancy = await vacancyRepository.findOneBy({ id: vacancyId });
    const newShortlist = shortlistRepository.create({
        name,
        vacancy,
    });
    return await shortlistRepository.save(newShortlist);
}
async function find(id, withDeleted = true) {
    const shortlist = await shortlistRepository.findOne({
        where: { id },
        relations: ["vacancy"],
        withDeleted: withDeleted,
    });
    return shortlist;
}
async function findByName(name, vacancyId) {
    const shortlist = await shortlistRepository.findOne({
        where: {
            name,
            vacancy: {
                id: vacancyId,
            },
        },
        withDeleted: true,
    });
    return shortlist;
}
async function findById(shortlistId, vacancyId) {
    return await shortlistRepository.findOne({
        where: { id: shortlistId, vacancy: { id: vacancyId } },
    });
}
async function update(shortlist, values) {
    const newShortlist = shortlistRepository.merge(shortlist, values);
    await shortlistRepository.save(newShortlist);
    return newShortlist;
}
async function remove(shortlistId, vacancyId) {
    return await shortlistRepository.delete({
        id: shortlistId,
        vacancy: { id: vacancyId },
    });
}
async function findShortlist(shortlistId, vacancyId) {
    const shortlist = await shortlistRepository.findOne({
        where: {
            id: shortlistId,
            vacancy: {
                id: vacancyId,
            },
        },
    });
    return shortlist;
}
export const shortlistService = {
    create,
    update,
    remove,
    findByName,
    find,
    findById,
    findShortlist,
};
//# sourceMappingURL=shortlist.service.js.map