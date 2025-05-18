import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { I18nProvider } from '@/lib/i18n/i18n-context';
import { SalesProvider } from '@/lib/context/sales-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sr & SraBurger Manager',
  description: 'Sistema de gestión para Sr & SraBurger - Hamburguesas, hot dogs y postres',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <SalesProvider>
              <div className="relative flex min-h-screen">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                  <main className="flex-1">{children}</main>
                </div>
                <Toaster />
              </div>
            </SalesProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}