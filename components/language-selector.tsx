"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Languages, Check, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
  direction: "ltr" | "rtl"
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    direction: "ltr",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    direction: "rtl",
  },
 
]

interface LanguageSelectorProps {
  selectedLanguage: string
  onLanguageChange: (languageCode: string) => void
  variant?: "dropdown" | "compact"
  className?: string
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  variant = "dropdown",
  className,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = SUPPORTED_LANGUAGES.find((lang) => lang.code === selectedLanguage) || SUPPORTED_LANGUAGES[0]

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Globe className="w-4 h-4 text-muted-foreground" />
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <span className="text-lg mr-1">{currentLanguage.flag}</span>
              <span className="text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {SUPPORTED_LANGUAGES.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => {
                  onLanguageChange(language.code)
                  setIsOpen(false)
                }}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{language.flag}</span>
                  <span className="text-sm">{language.name}</span>
                </div>
                {selectedLanguage === language.code && <Check className="w-4 h-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Languages className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium">Select Language</span>
      </div>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-12 px-4 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentLanguage.flag}</span>
              <div className="text-left">
                <div className="font-medium">{currentLanguage.name}</div>
                <div className="text-xs text-muted-foreground">{currentLanguage.nativeName}</div>
              </div>
            </div>
            <Languages className="w-4 h-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-64 p-2">
          <div className="space-y-1">
            {SUPPORTED_LANGUAGES.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => {
                  onLanguageChange(language.code)
                  setIsOpen(false)
                }}
                className={cn(
                  "flex items-center justify-between p-3 rounded-md cursor-pointer transition-all duration-200",
                  selectedLanguage === language.code ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50",
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div>
                    <div className="font-medium text-sm">{language.name}</div>
                    <div className="text-xs text-muted-foreground">{language.nativeName}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {language.direction === "rtl" && (
                    <Badge variant="secondary" className="text-xs">
                      RTL
                    </Badge>
                  )}
                  {selectedLanguage === language.code && <Check className="w-4 h-4 text-primary" />}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
