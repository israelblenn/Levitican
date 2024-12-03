import type { Metadata } from "next";
import "./globals.scss";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.svg";
import youtube from "@/public/youtube.svg"
import instagram from "@/public/instagram.svg"
import twitter from "@/public/twitter.svg"

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
            <div className="nav-header">
              <Link href="/"><Image priority src={logo} alt="levitican logo" height={72} /></Link>
              <div className="socials">
                <Link className="flex" href={'https://www.youtube.com/@LEVITICAN'}><Image priority src={youtube} alt="youtube" height={21}/></Link>
                <Link className="flex" href={'https://instagram.com/LEVITICAN_ARTS'}><Image priority src={instagram} alt="instagram" height={21}/></Link>
                <Link className="flex" href={'https://x.com/LEVITICAN_ARTS'}><Image priority src={twitter} alt="twitter" height={21}/></Link>
              </div>
            </div>
            <nav>
              <ul>
                <li><Link href="/video">VIDEO</Link></li>
                <li><Link href="/design">DESIGN</Link></li>
                <li><Link href="/design">ILLUSTRATION</Link></li>
                <li><Link href="/about">ABOUT</Link></li>
                <li><Link href="/contact">CONTACT</Link></li>
              </ul>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
