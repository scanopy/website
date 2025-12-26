import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import { Analytics } from '@/components/Analytics';
import { CookieConsent } from '@/components/CookieConsent';
import { MethodColors } from '@/components/method-colors';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  title: {
    default: 'Scanopy Docs',
    template: '%s | Scanopy Docs',
  },
  description: 'Documentation for Scanopy - Network discovery and visualization',
  icons: {
    icon: '/docs/scanopy-logo.png',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${inter.className} dark`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{
            options: {
              type: 'static',
              api: '/docs/api/search',
            },
          }}
          theme={{
            defaultTheme: 'dark',
            forcedTheme: 'dark',
          }}
        >
          {children}
          <Analytics />
          <CookieConsent />
          <MethodColors />
        </RootProvider>
      </body>
    </html>
  );
}
