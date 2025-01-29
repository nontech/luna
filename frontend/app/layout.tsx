import "./globals.css";
import Providers from "./components/Providers";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Luna",
  description: "Luna Learning Platform",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The hydration error is commonly caused by browser extensions (particularly Grammarly) adding attributes to the HTML that don't match the server-rendered content. The specific attributes mentioned (data-gr-ext-installed, cz-shortcut-listen, etc.) are added by extensions.
    // Suppress hydration warnings
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/codemirror.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/theme/monokai.min.css"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/codemirror.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/mode/python/python.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
