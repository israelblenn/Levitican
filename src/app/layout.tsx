import type { Metadata } from "next";
import "./globals.scss";
import Image from "next/image";
import Link from "next/link";
import CloseNav from "@/src/components/closenav";
import logo from "@/public/logo.svg";
import youtube from "@/public/youtube.svg";
import instagram from "@/public/instagram.svg";
import twitter from "@/public/twitter.svg";

export const metadata: Metadata = {
  title: "Levitican",
};

export default function RootLayout({ children, }: Readonly<{children: React.ReactNode; }>) {

  console.log('%c Oh my heavens! ', 'background: #19191a; color: #cba054');
  console.log(
    '%c' +
    `
      ⠀⠀⠀⠀⠀⠠⡐⢦⣧⣾⡽⣯⢿⣽⣿⣽⢻⡝⢮⣕⣷⣿⢾⣹⡳⢎⡵⢪⡜⣱⢫⡜⣦⠓⣌⠖⡘⠦⡑⢆⠆⡀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⢈⣵⣾⣿⣾⣿⢿⣟⣿⡿⣭⣏⣧⣿⣿⣿⣿⣿⣿⣳⣟⣿⢾⡱⢮⡱⢯⡽⣎⣿⡔⣫⠜⣲⠙⠎⠆⡑⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⢠⡞⣿⣿⣿⣻⣽⣻⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣞⣽⣿⣻⣿⣻⣽⣷⣿⣾⣟⣛⢻⢚⡛⠊⠽⠋⠁⠀⠀⠀⠀
      ⠀⠀⠀⠀⣠⣯⣽⣿⣿⣷⣿⣿⣿⣿⣿⣟⣿⢾⣟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣻⣯⣿⣿⣽⣿⣿⣾⣿⣿⣮⡆⠄⠰⡀⠴⠀⠀⠀⠀
      ⠀⠀⠀⢀⣵⠿⣿⣿⣿⣾⣿⡿⡿⠇⡙⢍⣲⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⡿⣟⣿⣿⣿⣿⣿⣿⣿⣿⡾⢥⡀⠀⠀⠁⠀⠀⠀⠀⠀
      ⠀⠀⣠⠾⢃⡾⣿⣿⣿⣿⣷⣿⣴⢎⣼⣿⡿⡟⠛⢉⣥⣿⣾⣽⣳⣽⢾⣿⣿⣿⡿⣿⢏⠥⡺⣁⣈⠻⠾⠟⡔⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠈⢠⣾⢛⣿⣿⣿⣿⡽⢹⣡⣾⡿⣫⡵⠞⣛⠳⣍⢩⡿⣿⣽⣿⣻⣦⢟⣿⣿⣽⣿⡇⢀⣀⢄⣍⠂⣤⢠⢀⠐⠖⠀⠀⠀⠀
      ⠀⠀⠀⡴⡽⣿⣿⣿⣿⢋⠄⣿⣿⣟⠜⢫⡀⠈⠉⣠⠘⢧⣱⣿⣿⣿⣿⣿⣯⣿⣷⣴⡏⠀⠎⠆⠀⠈⠱⢤⢏⠻⠏⠀⠀⠀⠀⠀
      ⠀⠀⠀⠊⢈⢖⣻⡟⣳⠈⣸⣿⠟⣡⣤⣌⡛⠓⠲⠶⢚⠖⣡⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠐⠤⣀⣀⠀⠀⠈⠋⠆⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠱⢰⣿⣿⣽⡿⠸⣷⣧⣿⣿⣿⣿⣾⣾⣧⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣴⣓⢀⠀⠀⠀⠀⠀⠆⡇⠀⠀⠠⠐⠄
      ⠀⠀⠀⢂⣼⡿⡽⠛⠐⣹⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣘⡠⡀⠀⢆⢨⡓⢄⣂⢀⠀⠀
      ⠀⠀⠀⢻⠋⡜⢣⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⡌⢎⣧⠈⣎⡄⠀⠀
      ⠀⠀⠀⠀⠘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡌⢞⡇⠡⠳⠂⠀
      ⠀⠀⠀⣠⣷⢫⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣻⣿⠿⢿⣿⠖⣶⣿⣿⣿⣿⣿⣿⣣⠀⠡⠘⠄
      ⠀⠀⠰⢡⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣸⣯⣿⡿⠟⠋⠛⠁⢸⣾⠿⣽⣿⣽⣻⣿⣯⣿⡄⠀⠁⠀
      ⠀⠀⣠⡿⣟⣿⣾⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡉⠀⠀⠠⠀⠐⠀⠀⣠⠟⣻⢾⣿⡷⣟⣾⣿⣿⣿⠀⠀⠀
      ⠀⠀⢹⢸⣿⣽⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢿⣿⣿⢿⣿⢿⡿⢷⣿⣿⣍⠉⠙⠀⠀⢀⣴⣏⣈⡉⣧⣿⣯⡿⣟⣿⡟⣽⡄⠀⠀
      ⠀⠀⠴⡌⢃⡿⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣏⢆⣿⡁⠀⠁⡛⠣⠾⢿⠿⣻⢚⡂⠠⠎⠻⢏⠛⠄⢿⠻⠾⠳⣽⣿⣿⡿⠀⡧⠀⠀
      ⠀⠀⢄⠇⢟⣿⣿⣟⣯⣿⣿⣿⣿⣿⣿⣿⡏⠻⣾⣿⣾⣷⣻⣻⣶⣦⣤⣀⣀⢠⣤⣤⡒⠀⠀⠀⠀⠈⢸⣧⣻⣿⣿⡄⠠⠁⠀⠀
      ⠀⠀⠀⠳⢬⡏⣿⣿⣟⡾⣿⣿⣿⣿⣿⢿⣯⢀⣿⣽⣿⣧⣿⣿⣿⣿⢿⣿⣋⡟⡶⣖⣬⡇⠤⢀⢀⡶⠁⣻⣽⡇⣿⠏⠀⠀⠀⠀
      ⠀⠀⠀⠀⠰⡻⣿⣽⣿⣿⣿⢿⣧⡿⡏⠻⢋⣸⣟⣿⡻⣶⣿⣿⢯⣿⣯⡟⣼⣿⡱⢿⣞⣿⡜⡇⠎⢿⢩⣿⢻⡇⠃⠰⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠈⢏⣷⣊⡿⣿⣯⣷⣿⢧⣑⣦⣹⣿⣯⣟⣿⣳⣿⣯⢯⢹⠐⡺⢯⠘⣽⣿⢿⢿⠀⢊⠘⢸⡷⡬⡨⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠈⠫⣿⡽⠊⢛⠛⣦⢵⡿⢹⣿⣿⣿⣷⣯⣿⣿⣿⡸⠿⡇⣾⣼⣿⣯⠊⣹⠀⢦⡀⠤⠚⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠟⠛⠓⢺⢸⣿⣿⣿⣟⡟⣿⡝⢀⠸⡗⣻⣷⡿⠃⢴⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
      ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠽⢛⠿⡽⡿⠇⠘⠇⠘⠀⠑⠸⠘⠃⠀⠀⠀⠀
    ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    ` + '%c  ♥ ♥ ♥  © 2024 This site is dedicated to kye my beloved  ♥ ♥ ♥  ', 
    'color: #ebd4ac', 'background: #19191a; color: #cba054',
  );

  return (
    <html lang="en">
      <body>
        <header>
          <div className="nav-header">
            <Link href="/"><Image src={logo} alt="levitican logo" height={72} className="logo" priority /></Link>
            <div className="socials">
              <Link className="flex" href={'https://www.youtube.com/@LEVITICAN'}><Image src={youtube} alt="youtube" height={21}/></Link>
              <Link className="flex" href={'https://instagram.com/LEVITICAN_ARTS'}><Image src={instagram} alt="instagram" height={21}/></Link>
              <Link className="flex" href={'https://x.com/LEVITICAN_ARTS'}><Image src={twitter} alt="twitter" height={21}/></Link>
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
              <Link className="flex" href={'https://www.youtube.com/@LEVITICAN'}><Image src={youtube} alt="youtube" height={26}/></Link>
              <Link className="flex" href={'https://instagram.com/LEVITICAN_ARTS'}><Image src={instagram} alt="instagram" height={26}/></Link>
              <Link className="flex" href={'https://x.com/LEVITICAN_ARTS'}><Image src={twitter} alt="twitter" height={26}/></Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <CloseNav />
      </body>
    </html>
  );
}
