"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { LoginButton, LogoutButton } from "./AuthButtons";

export default function Navbar() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <div className="navbar bg-[#8c52ff]">
      {/* Left side of navbar */}
      <div className="flex-1">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.png"
            alt="Luna Logo"
            width={32}
            height={32}
            loading="eager"
          />
        </Link>
        {user && (
          <Link
            href="/classrooms"
            className={clsx("text-white hover:text-gray-200 ml-4", {
              "text-gray-200": pathname === "/classrooms",
            })}
          >
            Classrooms
          </Link>
        )}
      </div>

      {/* Right side of navbar */}
      <div className="flex-none gap-2">
        {user ? (
          <>
            <div className="text-white text-sm">
              Welcome, {user.username}!, You are a {user.user_role}
            </div>
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </div>
    </div>
  );
}
