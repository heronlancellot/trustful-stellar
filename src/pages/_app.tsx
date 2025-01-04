import "@/styles/globals.css";
import "@/styles/card-link.css";
import "@/styles/content-tabs.css";
import "@/styles/custom-table.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "tailwindcss/tailwind.css";
import "react-tooltip/dist/react-tooltip.css";
import { Inter } from "next/font/google";

import { type AppProps } from "next/app";

import { Toaster } from "react-hot-toast";
import { DappHeader } from "@/components/organisms";
import { AuthProvider } from "@/components/auth/Context";
import { UserContextProvider } from "@/components/user/Context";
import { CommunityContextProvider } from "@/components/community/Context";
import { Tooltip } from "react-tooltip";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <UserContextProvider>
        <CommunityContextProvider>
          <div className={`${inter.className} h-screen flex flex-col`}>
            <DappHeader />
            <main>
              <div className="relative h-full flex-grow">
                <Toaster
                  position="bottom-center"
                  toastOptions={{
                    duration: 5000,
                    style: {
                      background: "rgba(22, 22, 23, 1)",
                      color: "rgba(245, 255, 255, 1)",
                      fontSize: "14px",
                    },
                  }}
                />
                <Component {...pageProps} />
              </div>
            </main>
          </div>
        </CommunityContextProvider>
      </UserContextProvider>
    </AuthProvider>
  );
}
