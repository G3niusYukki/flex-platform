import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '灵活用工平台',
  description: '专业的灵活用工服务平台，为您提供优质的人才和机会',
  keywords: ['灵活用工', '兼职招聘', '临时工', '小时工', '用工平台'],
};

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
