"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import icongoogle from "../../../../public/images/icon-google.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  useSession } from "next-auth/react";
import Link from "next/link";
import {  Eye, EyeOff, Heart } from "lucide-react";

function Register() {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    name: HTMLInputElement;
    email: HTMLInputElement;
    password: HTMLInputElement;
  }

  interface RegisterFormElement extends HTMLFormElement {
    readonly elements: FormElements;
  }

  const handleSubmit = async (e: React.FormEvent<RegisterFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const name = e.currentTarget.elements.name.value;
    const email = e.currentTarget.elements.email.value;
    const password = e.currentTarget.elements.password.value;

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!password) {
      toast.info("Password is required");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      toast.info("Password must be at least 8 characters long");
      setIsLoading(false);
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
        toast.success(
          "Account created successfully! Please check your email to verify your account."
        );
        router.push("/verify-email-sent");
      } else if (res.status === 400) {
        toast.error("An account with this email already exists");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Unable to connect. Please check your internet connection.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (sessionStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <div className="animate-pulse flex flex-col items-center">
          <Heart className="h-12 w-12 fill-rose-500 text-rose-500 mb-4" />
          <p className="text-rose-800">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="min-h-screen bg-rose-50 flex flex-col">
        {/* Header */}
        {/* <div className="container mx-auto px-4 py-6">
          <Link href="/" passHref>
            <div className="inline-flex items-center text-rose-700 hover:text-rose-800 transition-colors font-medium">
              <ArrowLeft className="mr-2" size={20} />
              Back to Home
            </div>
          </Link>
        </div> */}

        {/* Main Content */}
        <div className="flex flex-1 items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-3 rounded-full shadow-lg">
                <Heart className="h-10 w-10 fill-rose-500 text-rose-500" />
              </div>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-rose-100">
              <div className="bg-rose-500 py-3">
                <h2 className="text-center text-white font-bold text-xl">
                  Join MamaSphere
                </h2>
              </div>

              <div className="px-8 py-6">
                <p className="text-center text-gray-600 mb-6">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-colors"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 transition-colors pr-12"
                        placeholder="At least 8 characters"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-rose-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                {/* <div className="my-6 flex items-center">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="mx-4 text-gray-500 text-sm">
                    Or continue with
                  </span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div> */}

                {/* <button
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => signIn("google")}
                  disabled={isLoading}
                >
                  <Image src={icongoogle} alt="Google" width={20} height={20} />
                  Google
                </button> */}

                <p className="text-xs text-gray-500 text-center mt-6">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-rose-600 hover:text-rose-700">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-rose-600 hover:text-rose-700">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default Register;
