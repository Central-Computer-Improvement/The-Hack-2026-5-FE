import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart Recipe AI",
  description: "Masak dengan apa yang ada, kurangi sisa makanan",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col m-0 p-0 overflow-hidden">
        <div className="flex h-screen bg-[#F6F8F6] font-sans text-gray-800 antialiased overflow-hidden w-full">
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-y-auto w-full">
            <Navbar />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
