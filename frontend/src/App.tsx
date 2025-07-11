import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "@/components/layout/layout";
import HomePage from "@/pages/home";
import { QueryClientProvider } from "@/providers/query-client-provider/query-client-provider";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
