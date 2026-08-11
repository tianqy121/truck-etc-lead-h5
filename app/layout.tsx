import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://truck-etc-lead-h5.vercel.app"),
  title: "企业货车ETC批量办理咨询",
  description: "批量签约、车辆管理、通行对账，专人跟进服务。",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: "企业货车ETC批量办理咨询",
    description: "批量签约、车辆管理、通行对账，专人跟进服务。",
    siteName: "鑫出行（ETC）",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "企业货车ETC批量办理咨询" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "企业货车ETC批量办理咨询",
    description: "批量签约、车辆管理、通行对账，专人跟进服务。",
    images: ["/opengraph-image"],
  },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
