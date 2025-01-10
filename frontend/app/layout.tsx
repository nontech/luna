"use client";
import "./globals.css";
import Providers from "./components/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The hydration error is commonly caused by browser extensions (particularly Grammarly) adding attributes to the HTML that don't match the server-rendered content. The specific attributes mentioned (data-gr-ext-installed, cz-shortcut-listen, etc.) are added by extensions.
    // Suppress hydration warnings
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
