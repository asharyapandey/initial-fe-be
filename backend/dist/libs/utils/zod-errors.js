export const formatZodErrors = (issues) => {
    return issues.map((issue) => ({ path: issue.path, message: issue.message }));
};
//# sourceMappingURL=zod-errors.js.map