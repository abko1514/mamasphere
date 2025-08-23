"use client";

import React, { useEffect, useState } from "react";

interface DbUser {
  email: string;
  role: string;
}

import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AvatarIcon } from "@radix-ui/react-icons";

const UserDropdown = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.email) {
        try {
          const response = await fetch(`/api/users?email=${user.email}`);
          const userData = await response.json();
          setDbUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user?.email]);

  const getDashboardLink = () => {
    if (!dbUser?.role) return "/";
    return dbUser.role === "user" ? "/user" : "/editor";
  };

  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <AvatarIcon className="w-8 h-8" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-4">
          {user ? (
            <div>
              <div className="flex items-center gap-4">
                <div className="mx-auto text-center">
                  <p className="text-lg font-semibold">{user.name}</p>
                  <p className="text-sm">{user.email}</p>
                  {isLoading ? (
                    <p className="text-sm text-gray-400">Loading...</p>
                  ) : (
                    <p className="text-sm">
                      {dbUser?.role ? dbUser.role.toUpperCase() : ""}
                    </p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator className="my-4" />
              <div className="flex flex-col gap-2">
                <Link href="/" passHref>
                  <Button variant="ghost" className="w-full text-left">
                    Home
                  </Button>
                </Link>
                {/* <Link href="/feed" passHref>
                  <Button variant="ghost" className="w-full text-left">
                    Feed
                  </Button>
                </Link> */}
                <Link href={getDashboardLink()} passHref>
                  <Button variant="ghost" className="w-full text-left">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full text-left"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-center">
              No user information available.
            </p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropdown;
