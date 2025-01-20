import "./globals.css";
import Providers from "./components/Providers";
import type { Metadata } from "next";

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
        <script src="https://cdn.jsdelivr.net/pyodide/v0.27.1/full/pyodide.js"></script>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/codemirror.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/theme/monokai.min.css"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/codemirror.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/mode/python/python.min.js"></script>
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
