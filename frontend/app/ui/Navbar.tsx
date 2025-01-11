"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="navbar bg-[#8c52ff]">
      {/* Left side of navbar */}
      <div className="flex-1">
        <Link href="/" className="text-xl">
          <img
            src="/logo.png"
            alt="Project Luna Logo"
            width={60}
            height={60}
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
              Welcome, {user.username}!
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-error btn-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
