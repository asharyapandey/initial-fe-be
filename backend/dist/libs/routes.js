export const routes = {
    designation: {
        base: "/designations",
        single: "/designations/:designationId",
        toggleStatus: "/designations/:designationId/toggle-status",
    },
    medium: {
        base: "/mediums",
        single: "/mediums/:mediumId",
        toggleStatus: "/mediums/:mediumId/toggle-status",
    },
    vacancy: {
        base: "/vacancies",
        single: "/vacancies/:vacancyId",
        toggleStatus: "/vacancies/:vacancyId/toggle-status",
        shortlist: {
            base: "/vacancies/:vacancyId/shortlists",
            single: "/vacancies/:vacancyId/shortlists/:shortlistId",
            candidates: {
                shortlistCandidates: "/vacancies/:vacancyId/candidates",
                singleCandidate: "/vacancies/:vacancyId/candidates/:candidateId",
            },
        },
        candidate: {
            base: "/vacancies/:vacancyId/candidates",
            single: "/vacancies/:vacancyId/candidates/:candidateId",
            updateStatus: "/vacancies/:vacancyId/candidates/:candidateId/update-status",
        },
    },
    candidate: {
        base: "/candidates",
        single: "/candidates/:candidateId",
        search: "/candidates/search",
    },
    login: "/login",
    status: {
        base: "/status",
        single: "/status/:statusId",
        toggleStatus: "/status/:statusId/toggle-status",
    },
};
//# sourceMappingURL=routes.js.map