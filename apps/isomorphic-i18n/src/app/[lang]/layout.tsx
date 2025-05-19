import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import AuthProvider from "@/app/api/auth/[...nextauth]/auth-provider";
import GlobalDrawer from "@/app/shared/drawer-views/container";
import GlobalModal from "@/app/shared/modal-views/container";
import { ThemeProvider } from "@/app/shared/theme-provider";
import { siteConfig } from "@/config/site.config";
import { elTajawal } from "@/app/fonts";
import cn from "@utils/class-names";
import { dir } from "i18next";
import { languages } from "../i18n/settings";
import { UserProvider } from "../components/context/UserContext";
import { GuardProvider } from "../components/context/GuardContext";
import { QrStyleProvider } from "../components/contsxt1";

const NextProgress = dynamic(() => import("@components/next-progress"), {
  ssr: false,
});

export const metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: any;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html
      lang={lang}
      dir={dir(lang)}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={cn(elTajawal.variable ,'font-elTajawal')}
      >
        <QrStyleProvider>
          <GuardProvider>
            <UserProvider>
              <AuthProvider session={session}>
                <ThemeProvider>
                  <NextProgress />
                  {children}
                  <Toaster
                    toastOptions={{
                      style: {
                        zIndex: 999999,
                      },
                    }}
                    containerStyle={{
                      zIndex: 999999,
                      position: 'fixed',
                      left: 0,
                      top:20,
                    }}
                  />
                  <GlobalDrawer lang={lang} />
                  <GlobalModal />
                </ThemeProvider>
              </AuthProvider>
            </UserProvider>
          </GuardProvider>
        </QrStyleProvider>
      </body>
    </html>
  );
}
