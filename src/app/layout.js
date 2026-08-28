import { IBM_Plex_Sans, Work_Sans } from "next/font/google";
import "./globals.css";
import AppShell from "../components/AppShell";
import { AuthProvider } from "../context/AuthContext";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const workSans = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Smart Recipe AI — Masak Cerdas, Bebas Sampah Makanan",
  description: "Smart Recipe AI membantu Anda memasak dengan bahan yang ada di dapur, mengurangi pemborosan makanan, dan menghemat pengeluaran bulanan.",
  keywords: "resep, zero waste, pantry tracker, meal planning, indonesia",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${ibmPlexSans.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full m-0 p-0 font-body">
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
