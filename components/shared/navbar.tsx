"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
import { LogOut, Settings, User } from "lucide-react";

// Navigation items configuration
const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

// User dropdown menu items
const userMenuItems = [
  { label: "Profile", icon: User, onClick: () => console.log("Profile") },
  { label: "Settings", icon: Settings, onClick: () => console.log("Settings") },
  { label: "Logout", icon: LogOut, onClick: () => console.log("Logout") },
];

export function Navbar() {
  return (
    <nav className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-48 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-foreground">
          Next Js
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="rounded-full cursor-pointer">
              <User className="w-4 h-4 text-primary"></User>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p>name</p>
                <p>email</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <DropdownMenuItem key={item.label} onClick={item.onClick}>
                  <Icon data-icon="inline-start" />
                  <span>{item.label}</span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
