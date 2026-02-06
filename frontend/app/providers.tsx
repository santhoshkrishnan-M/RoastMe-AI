'use client';

import { ReactNode } from 'react';
import { TamboProvider } from '@/lib/tamboMock/TamboProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TamboProvider>
      {children}
    </TamboProvider>
  );
}
