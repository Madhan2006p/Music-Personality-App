"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Menu, X, Music } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

export function Navigation() {
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Mobile Navigation */}
      <nav className="md:hidden border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1DB954] flex items-center justify-center">
                <Music className="w-5 h-5 text-black" />
              </div>
              <span className="font-semibold">Sonalysis</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border/50 px-6 py-4 space-y-3">
            <Link
              href="/results?demo=true"
              className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Demo
            </Link>
            {!isLoading && (
              <>
                {user ? (
                  <Link
                    href="/profile"
                    className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full" size="sm">Sign In</Button>
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden md:block border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1DB954] flex items-center justify-center">
                <Music className="w-5 h-5 text-black" />
              </div>
              <span className="font-bold text-lg tracking-tight">Sonalysis</span>
            </Link>

            <div className="flex items-center gap-5">
              <Link
                href="/results?demo=true"
                className={`text-sm transition-colors ${
                  pathname?.startsWith("/results") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Demo
              </Link>

              {!isLoading && (
                <>
                  {user ? (
                    <Link
                      href="/profile"
                      className={`transition-colors ${
                        pathname === "/profile" ? "text-primary" : "text-foreground/80 hover:text-foreground"
                      }`}
                      title="Profile"
                    >
                      <User className="w-5 h-5" />
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button size="sm" className="text-sm bg-[#1DB954] hover:bg-[#1ED760] text-black rounded-full" asChild>
                        <Link href="/auth/login">Sign In</Link>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
