"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { siteConfig } from "@/config/site"
import { navLinks } from "@/lib/links"
import { settings } from "@/config/settings"
import { Icons } from "./icons"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

export default function ProfNavbar() {
  const [navbar, setNavbar] = useState(false)

  const handleClick = async () => {
    setNavbar(false)
  }
  
  let uuid: string | null, token: string | null;
  if (typeof window !== 'undefined') {
    uuid = localStorage.getItem('uuid');
    token = localStorage.getItem('token');
  }

  const router = useRouter()
  const profclick = () => {
    if (uuid == null || token == null){
      router.push('/login')
    }
    else{
      router.push(`/profile/`+uuid)
    }
  }

  const logout = () => {
    if (uuid == null || token == null){
      router.push('/login')
    }
    else{
      localStorage.removeItem('uuid')
      localStorage.removeItem('token')
      console.log(localStorage.getItem('token'))
      console.log(localStorage.getItem('uuid'))
      router.push('/')
    }
  }

  useEffect(() => {
    if (navbar) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
  }, [navbar])

  return (
    <header className="select-none">
      <nav className="mx-auto justify-between px-4 md:flex md:items-center md:px-8 lg:max-w-7xl">
        <div className="mt-2">
          <div className="flex items-center justify-between py-3 md:block md:py-5">
            <Link href="/" onClick={handleClick}>
              <h1 className="text-2xl font-bold duration-200 lg:hover:scale-[1.10]">
                {siteConfig.name}
              </h1>
            </Link>
            <div className="flex gap-1 md:hidden">
              <button
                className="rounded-md p-2 text-primary outline-none focus:border focus:border-primary"
                aria-label="Hamburger Menu"
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 "
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 "
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
              <ModeToggle />
            </div>
          </div>
        </div>
        <div className="mt-2">
          <div
            className={`absolute left-0 right-0 z-10 m-auto justify-self-center rounded-md border bg-background p-4 md:static md:mt-0 md:block md:border-none md:p-0 ${
              navbar ? "block" : "hidden"
            }`}
            style={{ width: "100%", maxWidth: "20rem" }}
          >
            <ul className="flex flex-col items-center space-y-4 text-primary opacity-60 md:flex-row md:space-x-6 md:space-y-0">
              {navLinks.map((link) => (
                <li key={link.route}>
                  <Link
                    className="hover:underline"
                    href={link.path}
                    onClick={handleClick}
                  >
                    {link.route}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {settings.themeToggleEnabled && (
          <div className="hidden md:flex items-center space-x-4">
            <div className="mt-4">
                <ModeToggle />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex hover:cursor-pointer">
                  <Icons.list className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:rotate-0 dark:scale-100 dark:stroke-white stroke-black mt-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <div className="flex items-center hover:cursor-pointer space-x-2" onClick={profclick}>
                      <Icons.profile className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-0 dark:scale-100 dark:stroke-white stroke-black" />
                      <span>Your Profile</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div className="flex items-center hover:cursor-pointer space-x-2" onClick={logout}>
                      <Icons.logout className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all stroke-red-500" />
                      <span className="text-red-500 dark:text-red-300">Logout</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* <div className="flex hover:cursor-pointer" onClick={profclick}>
                <Icons.profile className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-0 dark:scale-100 dark:stroke-white stroke-black" />
            </div> */}
          </div>
        )}
        
      </nav>
    </header>
  )
}