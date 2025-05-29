"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { Keyboard, Menu, Home, Play, BarChart3, User } from "lucide-react"
import { cn } from "@/lib/utils"

// Add this import at the top
import { useTheme } from "next-themes"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Typing Test", href: "/test", icon: Play },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Profile", href: "/profile", icon: User },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  // In the Navigation component, add this after the existing state declarations:
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("selectedLanguage")
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    localStorage.setItem("selectedLanguage", languageCode)
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: languageCode }))
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Keyboard className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">TypingMaster</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              variant="compact"
            /> */}
            <ThemeToggle />
            {/* Debug theme info - remove this in production */}
       
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/" className="flex items-center space-x-2 mb-6">
                    <Keyboard className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl">TypingMaster</span>
                  </Link>

                  {/* Mobile Language Selector */}
                  <div className="mb-4">
                    <LanguageSelector
                      selectedLanguage={selectedLanguage}
                      onLanguageChange={handleLanguageChange}
                      variant="dropdown"
                    />
                  </div>

                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 text-lg font-medium transition-colors hover:text-primary p-2 rounded-md",
                        pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
