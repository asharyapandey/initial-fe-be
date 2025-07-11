import {
  QueryClient,
  QueryClientProvider as TanStackQueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode } from "react";

export const queryClient = new QueryClient();

export const QueryClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
    </TanStackQueryClientProvider>
  );
};
