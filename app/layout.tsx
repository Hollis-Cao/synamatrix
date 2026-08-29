import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./components/header";
import { Footer } from "./components/footer";

export const metadata: Metadata = {
  title: "Synamatrix｜脑机接口知识矩阵",
  description: "面向中国 BCI 研究者与爱好者的产品、论文、新技术和核心创新知识平台。",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (process.env.NODE_ENV === "production" && !publishableKey?.startsWith("pk_live_")) {
    throw new Error("Synamatrix production builds require the production Clerk publishable key.");
  }
  return <html lang="zh-CN"><body><ClerkProvider publishableKey={publishableKey} appearance={{ theme: shadcn }}><Header />{children}<Footer /></ClerkProvider></body></html>;
}
