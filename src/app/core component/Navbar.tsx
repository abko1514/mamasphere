"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import UserDropdown from "../../components/UserDropdown"; // Adjust path as needed

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  console.log(setIsOpen);
  return (
    <nav className="bg-white shadow-lg border-b-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-pink-600 flex items-center gap-3"
            >
              <img src="images/logo.png" alt="Logo" className="w-8 h-8" />
              MamaSphere
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/faq">FAQ</NavLink>

            {/* Conditionally render Login link or UserDropdown */}
            {status === "loading" ? (
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
            ) : session ? (
              <UserDropdown />
            ) : (
              <NavLink href="/login">Login</NavLink>
            )}
          </div>
         
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <MobileNavLink href="/features">Features</MobileNavLink>
            <MobileNavLink href="/about">About</MobileNavLink>
            <MobileNavLink href="/contact">Contact</MobileNavLink>
            <MobileNavLink href="/faq">FAQ</MobileNavLink>

            {/* Mobile menu authentication section */}
            {status === "loading" ? (
              <div className="pl-3 pr-4 py-2">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
            ) : session ? (
              <div className="pl-3 pr-4 py-2">
                <UserDropdown />
              </div>
            ) : (
              <MobileNavLink href="/login">Login</MobileNavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-pink-300 hover:text-gray-700"
  >
    {children}
  </Link>
);

const MobileNavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-teal-300 hover:text-gray-700"
  >
    {children}
  </Link>
);

export default Navbar;
