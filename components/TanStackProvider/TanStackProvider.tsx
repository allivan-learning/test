'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState, ReactNode } from 'react';

interface TanstackProviderProps {
  children: React.ReactNode;
}

export default function TanStackProvider({ children }: TanstackProviderProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
