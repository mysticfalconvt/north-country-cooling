import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="garden">
      <div className="bg-base-300 flex flex-col min-h-screen">
        <div className="h-full grow">
          <Nav />
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
