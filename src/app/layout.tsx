import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { DataProvider } from "@/context/DataContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
    icon: "/images/dmk-flag-sun.jpg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Exact Tamil & English Fonts from User Images: Catamaran (Image 1 Headline), Kavivanar & Arima (Image 2 Slogan), Anek Tamil, Mukta Malar, and Inter */}
        <link
          href="https://fonts.googleapis.com/css2?family=Anek+Tamil:wght@300;400;500;600;700;800;900&family=Catamaran:wght@400;500;600;700;800;900&family=Kavivanar&family=Arima:wght@400;500;600;700;800;900&family=Mukta+Malar:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800;900&family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8F6F2] text-[#1A1A1A] antialiased selection:bg-[#E31E24] selection:text-white">
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
