import type { Metadata } from "next";
import "./globals.scss";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Levitican",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/hbk5xbm.css" />
      </head>
      <body>
        <header>
          <nav className="navbar">
            <div className="container">
              <div className="logo"><Link href="/">MySite</Link></div>
              <ul>
                <li><Link href="/video">VIDEO</Link></li>
                <li><Link href="/design">DESIGN</Link></li>
                <li><Link href="/illustration">ILLUSTRATION</Link></li>
                <li><Link href="/about">ABOUT</Link></li>
                <li><Link href="/contact">CONTACT</Link></li>
              </ul>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
