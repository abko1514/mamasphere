"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import {  useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";

function ForgotPassword() {
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  interface FormElements extends HTMLFormControlsCollection {
    email: HTMLInputElement;
    password: HTMLInputElement;
  }

  interface RegisterFormElement extends HTMLFormElement {
    readonly elements: FormElements;
  }
  const handleSubmit = async (e: React.FormEvent<RegisterFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.elements.email.value;

    if (!isValidEmail(email)) {
      toast.error("Invalid email");
      return;
    }

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  email }),
      });
      if (res.status === 200) {
        toast.success("Password reset link sent to your email");
        router.push("/login");
      }
      if (res.status === 400) {
        toast.error("User not registered");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error);
    }
  };

  if (sessionStatus === "loading") {
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
                Forgot Password
              </h1>
              

              <div className="mt-[1rem] flex flex-col">
                <label htmlFor="email" className="mb-1 text-[#999]">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="px-4 py-3 border-[2px] rounded-md outline-black text-gray-800 dark:text-white border-slate-300 dark:border-none"
                  placeholder="johndoe@gmail.com"
                  required
                />
              </div>
             
              <div className="flex">
                <button
                  type="submit"
                  className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-teal-500 dark:bg-neutral-800 text-white rounded-md hover:bg-teal-700 dark:hover:bg-neutral-600 transition-colors cursor-pointer"
                >
                  Reset Password
                </button>
              </div>
              <p className="my-5 text-center">OR</p>
              <button
                className="flex-1 px-4 py-3 font-bold border-2 border-neutral-400 dark:border-0 hover:bg-zinc-200 text-neutral-800 dark:bg-zinc-900 dark:text-white rounded-md dark:hover:bg-zinc-700 transition-colors cursor-pointer w-full flex flex-row justify-center items-center gap-3"
               onClick={()=>{window.location.href="/login"}}
              >
                Go back to login
              </button>
            </div>
          </form>
        </div>
      </>
    )
  );
}

export default ForgotPassword;
