"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { signIn,useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import icongoogle from "../../../../public/images/icon-google.svg"
import Image from "next/image";
import { ArrowLeftCircle } from "lucide-react";
import Link from "next/link";

function Login() {
  const router =useRouter();
  const { status: sessionStatus } = useSession();
   const searchParams = useSearchParams();

   useEffect(() => {
     // Show success message if email was just verified
     if (searchParams?.get("verified") === "true") {
       toast.success("Email verified successfully! Please login.");
     }

     if (sessionStatus === "authenticated") {
       router.replace("/dashboard");
     }
   }, [sessionStatus, router, searchParams]);

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
     const password = e.currentTarget.elements.password.value;

     if (!isValidEmail(email)) {
       toast.error("Invalid email");
       return;
     }
     if (!password) {
       toast.info("Password is required");
       return;
     }

     const res= await signIn("credentials",{
      redirect:false,
      email,
      password,
     })

    if (res?.error) {
            // Check for specific verification error
            if (res.error === "Please verify your email before logging in") {
                toast.error("Please verify your email before logging in. Check your inbox for the verification link.");
            } else {
                toast.error("Invalid email or password");
            }
        } else {
            toast.success("Logged in successfully");
            if (res?.url) router.replace("/dashboard");
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
                Sign In
              </h1>
              <p className="mb-8 px-[2rem] text-center text-[#999] text-[16px]">
                Don&apos;t have an account?{" "}
                <a
                  href="/register"
                  className="font-bold text-teal-500 dark:text-slate-50 hover:text-slate-600 dark:hover:text-gray-500  transition-all duration-300"
                >
                  Register here
                </a>
              </p>

              <div className="mt-[1rem] flex flex-col">
                <label htmlFor="email" className="mb-1 text-[#999]">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="px-4 py-3 border-[2px] rounded-md outline-black text-gray-800 dark:text-white border-slate-300 dark:border-none"
                  placeholder="johndoe@gmail.com"
                  required
                />
              </div>
              <div className="relative mt-[1rem] flex flex-col">
                <label htmlFor="password" className="mb-1 text-[#999]">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="px-4 py-3 border-[2px] rounded-md outline-black text-gray-800 dark:text-white border-slate-300 dark:border-none"
                  placeholder="***************"
                  required
                />
                {/* <button
              type="button"
              className="absolute p-1 right-4 top-[43%] text-[22px] text-[#999] opacity-45"
            >
              {showPassword ? (
                <i className="fas fa-eye-slash" onClick={togglePassword}></i>
              ) : (
                <i className="fas fa-eye" onClick={togglePassword}></i>
              )}
            </button> */}
              </div>
              <div className="mt-4 flex justify-end">
                <a
                  href="/forgot-password"
                  className="font-bold text-teal-600 dark:text-slate-50 dark:hover:text-gray-500 text-[14px] hover:text-slate-600 transition-all duration-300"
                >
                  Forgot password?
                </a>
              </div>
              <div className="flex">
                <button
                  type="submit"
                  className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-teal-500 dark:bg-neutral-800 text-white rounded-md hover:bg-teal-700 dark:hover:bg-neutral-600 transition-colors cursor-pointer"
                >
                  Login Now
                </button>
              </div>
              <p className="my-5 text-center">OR</p>
              <button
                className="flex-1 px-4 py-3 font-bold border-2 border-neutral-400 dark:border-0 hover:bg-zinc-200 text-neutral-800 dark:bg-zinc-900 dark:text-white rounded-md dark:hover:bg-zinc-700 transition-colors cursor-pointer w-full flex flex-row justify-center items-center gap-3"
                onClick={() => {
                  signIn("google");
                }}
              >
                <Image src={icongoogle} alt="G" width={20} height={20} />
                Continue with Google
              </button>
            </div>
          </form>
        </div>
      </>
    )
  );
}

export default Login;
