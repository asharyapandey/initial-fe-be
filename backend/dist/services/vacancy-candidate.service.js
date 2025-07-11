import { In } from "typeorm";
import { VacancyCandidate } from "../entities/vacancy-candidate.entity.js";
import { AppDataSource } from "../libs/data-source.js";
import { getLimitOffset, getPaginatedResult, } from "../libs/utils/pagination.js";
const vacancyCandidateRepository = AppDataSource.getRepository(VacancyCandidate);
async function findCandidatesByShortlistId(shortlistIds) {
    return await vacancyCandidateRepository.find({
        where: { shortlist: { id: In(shortlistIds) } },
        relations: ["shortlist"],
    });
}
async function listCandidates(vacancyId, shortlistId, pagination, statuses) {
    const paginationQueries = getLimitOffset(pagination);
    const [result, count] = await vacancyCandidateRepository.findAndCount({
        where: {
            vacancy: { id: vacancyId },
            ...(shortlistId !== null && { shortlist: { id: shortlistId } }),
            ...(statuses && statuses.length > 0 && { status: { id: In(statuses) } }),
        },
        relations: ["vacancy", "shortlist", "candidate", "status"],
        ...paginationQueries,
    });
    return getPaginatedResult({
        count,
        page: pagination.page,
        pageSize: pagination.pageSize,
        result,
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
    });
    return vacancyCandidate;
}
async function removeCandidate(id) {
    await vacancyCandidateRepository.delete({ id });
}
export const vacancyCandidateService = {
    listCandidates,
    findCandidatesByShortlistId,
    removeCandidate,
    findCandidate,
};
//# sourceMappingURL=vacancy-candidate.service.js.map