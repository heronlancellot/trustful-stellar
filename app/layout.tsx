/* eslint-disable @next/next/no-page-custom-font */
import '@/styles/globals.css';
import '@/styles/card-link.css';
import '@/styles/content-tabs.css';
import '@/styles/custom-table.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'tailwindcss/tailwind.css';
import 'react-tooltip/dist/react-tooltip.css';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { DappHeader } from '@/components/organisms';
import { AuthProvider } from '@/components/auth/Context';
import { UserContextProvider } from '@/components/user/Context';
import { CommunityContextProvider } from '@/components/community/Context';
import { Tooltip } from 'react-tooltip';
import { ReactQueryProvider } from '@/lib/providers/ReactQueryProvider';
import { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata = {
  title: 'Trustful Stellar',
  description: 'Trustful Stellar - Reputation System',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${spaceGrotesk.variable}  `}>
        <ReactQueryProvider>
          <AuthProvider>
            <UserContextProvider>
              <CommunityContextProvider>
                <Toaster
                  position="bottom-center"
                  toastOptions={{
                    duration: 5000,
                    style: {
                      background: 'rgba(22, 22, 23, 1)',
                      color: 'rgba(245, 255, 255, 1)',
                      fontSize: '14px',
                    },
                  }}
                />
                {children}
              </CommunityContextProvider>
            </UserContextProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
