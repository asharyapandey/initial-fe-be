export function getLimitOffset({ page, pageSize }) {
    return {
        skip: (page - 1) * pageSize,
        take: pageSize,
    };
}
export function getPaginatedResult({ count, result, page, pageSize, }) {
    return {
        result,
        pagination: {
            count,
            totalPages: Math.ceil(count / pageSize),
            page,
            pageSize,
            isFirstPage: page === 1,
            isLastPage: page === Math.ceil(count / pageSize),
        },
    };
}
//# sourceMappingURL=pagination.js.map