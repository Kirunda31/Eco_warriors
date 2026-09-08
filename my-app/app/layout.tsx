import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PublicChrome from "./components/PublicChrome";

export const metadata: Metadata = {
  title: {
    default: "Eco Warriors Initiative Uganda",
    template: "%s | Eco Warriors Initiative Uganda",
  },
  description:
    "Working with communities for climate action, health, education, and sustainable livelihoods in Uganda.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <PublicChrome navbar={<Navbar />} footer={<Footer />}>{children}</PublicChrome>
      </body>
    </html>
  );
}
