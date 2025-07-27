"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster
          theme="light"
          className="border border-gray-200 shadow-lg rounded-lg"
          toastOptions={{
            classNames: {
              toast: "bg-white text-gray-900 border border-gray-200 rounded-lg",
              success: "bg-green-50 text-green-800 border-green-200",
              error: "bg-red-50 text-red-800 border-red-200",
              actionButton:
                "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-4 py-1",
              cancelButton: "bg-gray-100 text-gray-900 rounded-full px-4 py-1",
            },
          }}
        />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}