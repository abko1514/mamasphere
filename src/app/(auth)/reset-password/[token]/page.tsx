"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";

function ResetPassword({ params }: { params: { token: string } }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [verified,setVerified] = useState(false);
  interface User {
    email: string;
  }
  const [user, setUser] = useState<User | null>(null);
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: params.token }),
        });
        if (res.status === 200) {
          toast.success("Password reset token is valid");
          setError("");
          setVerified(true);
          const userData = await res.json();
          setUser(userData);
        }
        if (res.status === 400) {
          toast.error("Token is invalid or expired");
          setError("Token is invalid or expired");
          setVerified(true);
        }
      } catch (error) {
        toast.error("Something went wrong");
        console.log(error);
      }
    };
    verifyToken();
  },[params.token]);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);


  interface FormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
  }

  interface RegisterFormElement extends HTMLFormElement {
    readonly elements: FormElements;
  }
  const handleSubmit = async (e: React.FormEvent<RegisterFormElement>) => {
    e.preventDefault();
    const password = e.currentTarget.elements.password.value;

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email: user?.email, password}),
      });
      if (res.status === 200) {
        toast.success("Password changed successfully");
        setError("");
        router.push("/login");
      }
      if (res.status === 400) {
        toast.error("Error changing password");
        setError("Error changing password");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }

  };

  if (sessionStatus === "loading" || !verified) {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <>
        <Link href="/" passHref>
          <div className="flex gap-2 m-5">
            <ArrowLeftCircle />
            <p className="text-md">Back to Home</p>
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="relative m-[2rem] px-10 py-14 rounded-lg bg-white dark:bg-neutral-950 w-full max-w-[520px] mt-[0]"
          >
            <div className="relative z-10">
              <h1 className="mb-2 text-center text-[1.35rem] font-medium">
                Reset Password
              </h1>

              <div className="mt-[1rem] flex flex-col">
                <label htmlFor="email" className="mb-1 text-[#999]">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="px-4 py-3 border-[2px] rounded-md outline-black text-gray-800 dark:text-white border-slate-300 dark:border-none"
                  placeholder="******"
                  required
                />
              </div>

              <div className="flex flex-col">
                <span className="text-red-600 text-md text-center my-2">{error && error}</span>
                <button
                  type="submit"
                  disabled={error.length > 0}
                  className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-teal-500 dark:bg-neutral-800 text-white rounded-md hover:bg-teal-700 dark:hover:bg-neutral-600 transition-colors cursor-pointer"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </form>
        </div>
      </>
    )
  );
}

export default ResetPassword;