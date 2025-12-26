import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image
            src="/docs/scanopy-logo.png"
            alt="Scanopy"
            width={32}
            height={32}
            className="size-8"
          />
          <span className="font-bold">Scanopy</span>
        </>
      ),
      url: 'https://scanopy.net',
    },
    links: [
      {
        text: 'Demo',
        url: 'https://demo.scanopy.net',
        external: true,
      },
      {
        text: 'Login',
        url: 'https://app.scanopy.net/login',
        external: true,
      },
    ],
    githubUrl: 'https://github.com/scanopy/scanopy',
  };
}
