import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "../components/AppShell";
import { AuthProvider } from "../context/AuthContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Smart Recipe AI — Masak Cerdas, Bebas Sampah Makanan",
  description: "Smart Recipe AI membantu Anda memasak dengan bahan yang ada di dapur, mengurangi pemborosan makanan, dan menghemat pengeluaran bulanan.",
  keywords: "resep, zero waste, pantry tracker, meal planning, indonesia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full m-0 p-0">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
