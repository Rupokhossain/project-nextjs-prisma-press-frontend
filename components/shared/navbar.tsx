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
import { logout } from "@/service/logout";
import { toast } from "sonner";
// import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

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

type IUser = {
  success: boolean;
  message: string;
  data: {
    profile: {
      id: string;
      name: string;
      email: string;
      activeStatus: string;
      role: string;
      createdAt: string;
      updatedAt: string;
      profile: {
        id: string;
        profilePhoto: string;
        bio: string | null;
        userId: string;
        createdAt: string;
        updatedAt: string;
      };
    };
  };
};

type NavbarProps = {
  user: IUser;
};

export function Navbar({ user }: NavbarProps) {

  // const router = useRouter();

  const handleUserMenuAction = async (action: string) => {
    if (action === "logout") {
      await logout();
      toast.success("User Logged Out Successfuly");
    }
  };


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

        {user.success ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="rounded-full cursor-pointer">
                <User className="w-4 h-4 text-primary"></User>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">
                    {user?.data?.profile?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.data?.profile?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={async () => {
                      await handleUserMenuAction("logout");
                    }}
                  >
                    <Icon data-icon="inline-start" className="w-4 h-4 mr-2" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href={"/login"}>
            <Button className="cursor-pointer">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
