"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Image from "next/image";
import icongoogle from "../../../../public/images/icon-google.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signIn,useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeftCircle } from "lucide-react";

function Register() {

  const router=useRouter();
    const {  status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/login");
    }
  }, [sessionStatus, router]);

  const isValidEmail =(email:string)=>{
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      return emailRegex.test(email);
      
  }

  interface FormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement;
    email: HTMLInputElement;
    password: HTMLInputElement;
  }

  interface RegisterFormElement extends HTMLFormElement {
    readonly elements: FormElements;
  }

  const handleSubmit = async (e: React.FormEvent<RegisterFormElement>) => {
    e.preventDefault();
    const name = e.currentTarget.elements.name.value;
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
    if (password.length < 8) {
      toast.info("Password must be at least 8 characters long");
      return;
    }
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.status === 200) {
        toast.success("User registered successfully");
         router.push("/verify-email-sent");
      }
      if (res.status === 400) {
        toast.error("User already exists");
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
        {" "}
        <Link href="/" passHref>
          <div className="flex gap-2 m-5">
            <ArrowLeftCircle />
            <p className="text-md">Back to Home</p>
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="relative mx-[2rem] px-10 py-5 rounded-lg bg-white dark:bg-neutral-950 w-full max-w-[520px] mt-[-1rem]"
          >
            <div className="relative z-10">
              <h1 className="mb-2 text-center text-[1.35rem] font-medium">
                Sign Up
              </h1>
              <p className="mb-8 px-[2rem] text-center text-[#999] text-[16px]">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-bold text-teal-500 dark:text-slate-50 hover:text-slate-600 transition-all duration-300 dark:hover:text-gray-500"
                >
                  Login here
                </a>
              </p>
              <div className="flex flex-col">
                <label htmlFor="name" className="mb-1 text-[#999]">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="px-4 py-3 border-[2px] rounded-md outline-black dark:border-none text-gray-800 border-slate-300 dark:text-white"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="mt-[1rem] flex flex-col">
                <label htmlFor="email" className="mb-1 text-[#999]">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="px-4 py-3 border-[2px] rounded-md outline-black dark:border-none text-gray-800 border-slate-300 dark:text-white"
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
                  className="px-4 py-3 border-[2px] rounded-md outline-black dark:border-none text-gray-800 border-slate-300 dark:text-white"
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

              <div className="flex">
                <button
                  type="submit"
                  className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-teal-500 text-white rounded-md hover:bg-teal-700 cursor-pointer transition-colors dark:hover:bg-neutral-600 dark:bg-neutral-800 "
                >
                  Register Now
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

export default Register;
