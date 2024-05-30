import { Inter } from "next/font/google";
import "../../styles/globals.css";
import Navigator from "@/components/Navigator";
import Image from "next/image";
import Logo from "../../public/coffeeStream.png";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children, error }) {
  return (
      <html lang="en">
          <body className={`${inter.className} w-screen h-screen`}>
          <div className="flex flex-row ">
              <aside className="flex flex-col w-80 h-dvh bg-gray-800">
                  <div className="flex flex-col h-full shadow-lg">
                      <>
                          <header className="bg-sky-800 text-white p-5 text-lg font-bold">
                              <Link href={"/"}>
                                <Image src={Logo} alt={"Logo de coffeestream"}/>
                              </Link>
                          </header>
                          <Navigator/>
                          <div className="bg-sky-900 text-white p-5 text-sm">
                              © 2024 Axonite - All rights reserved
                          </div>
                      </>
                  </div>
              </aside>

              <main className="px-24 w-full h-full flex justify-center items-center flex-col ">
                  {children}
              </main>
          </div>
          </body>
      </html>
  )
      ;
}
