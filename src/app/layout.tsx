import type { Metadata } from "next";
import "./globals.scss";
import Image from "next/image";
import Link from "next/link";
import CloseNav from "@/src/components/closenav";
import logo from "@/public/logo.svg";
import youtube from "@/public/youtube.svg";
import instagram from "@/public/instagram.svg";
import x from "@/public/x.svg";

export const metadata: Metadata = {
  title: "LEVIAEL",
  description: "Motion · Art · Design",
};

export default function RootLayout({ children, }: Readonly<{children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body>
        <header>
          <div className="nav-header">
            <Link href="/"><Image src={logo} alt="leviael logo" height={72} className="logo" priority /></Link>
            <div className="socials">
              <Link className="flex" href={'https://www.youtube.com/@LEVIAEL'}><Image src={youtube} alt="youtube" height={21} width={24}/></Link>
              <Link className="flex" href={'https://instagram.com/leviael.art'}><Image src={instagram} alt="instagram" height={21}/></Link>
              <Link className="flex" href={'https://x.com/LEVIAEL_'}><Image src={x} alt="x" height={21}/></Link>
            </div>
          </div>
          <label className="hamburger"><input type="checkbox" /></label>
          <nav>
            <ul>
              <li><Link href="/video">VIDEO</Link></li>
              <li><Link href="/design">DESIGN</Link></li>
              <li><Link href="/illustration">ILLUSTRATION</Link></li>
              <li><Link href="/about">ABOUT</Link></li>
              <li><Link href="/contact">CONTACT</Link></li>
            </ul>
            <div className="socials-mobile">
              <Link className="flex" href={'https://www.youtube.com/@LEVIAEL'}><Image src={youtube} alt="youtube" height={26} width={30}/></Link>
              <Link className="flex" href={'https://instagram.com/leviael.art'}><Image src={instagram} alt="instagram" height={26}/></Link>
              <Link className="flex" href={'https://x.com/LEVIAEL_'}><Image src={x} alt="x" height={26}/></Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <CloseNav />
      </body>
    </html>
  );
}
