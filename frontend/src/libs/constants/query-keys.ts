// Pattern adopted from the following blog post:
// https://tkdodo.eu/blog/effective-react-query-keys

export const demoKeys = {
  // Remove me once there is real query keys
  all: ["companies"] as const,
  list: () => [...demoKeys.all, "list"] as const,
  detail: (id: string) => [...demoKeys.all, "detail", id] as const,
};
