import type { Metadata } from "next";
import { Catamaran, Noto_Serif_Tamil, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { DataProvider } from "@/context/DataContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const catamaran = Catamaran({
  subsets: ["latin", "tamil"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-catamaran",
  display: "swap",
});

const notoSerifTamil = Noto_Serif_Tamil({
  subsets: ["latin", "tamil"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-noto-serif-tamil",
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DMK Legal Wing | திராவிட முன்னேற்றக் கழகம் வழக்கறிஞர் அணி",
  description: "Official digital platform of the DMK Legal Wing (Dravida Munnetra Kazhagam Legal Wing), Tamil Nadu, India. Defending Social Justice, Federalism, State Autonomy, and Constitutional Democracy.",
  keywords: [
    "DMK Legal Wing",
    "திமுக வழக்கறிஞர் அணி",
    "Tamil Nadu Advocates",
    "Social Justice",
    "69% Reservation",
    "Madras High Court",
    "Supreme Court of India",
    "Federalism",
    "State Autonomy",
    "P. Wilson Senior Advocate"
  ],
  icons: {
    icon: "/images/dmk-official-logo.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta" className={`${catamaran.variable} ${notoSerifTamil.variable} ${sourceSerif4.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#111111] antialiased selection:bg-[#E31E24] selection:text-white">
        <LanguageProvider>
          <DataProvider>
            <Header />
            <main className="flex-1 w-full">
              {children}
            </main>
            <Footer />
          </DataProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
