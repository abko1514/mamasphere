"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import icongoogle from "../../../../public/images/icon-google.svg";
// import Image from "next/image";
import { Eye, EyeOff, Heart } from "lucide-react";
import Link from "next/link";

function Login() {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
    setIsLoading(true);

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

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      if (res.error === "Please verify your email before logging in") {
        toast.error(
          "Please verify your email before logging in. Check your inbox for the verification link."
        );
      } else {
        toast.error("Invalid email or password");
      }
    } else {
      toast.success("Welcome back!");
      if (res?.url) router.replace("/dashboard");
    }

    setIsLoading(false);
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
                  Welcome Back
                </h2>
              </div>

              <div className="px-8 py-6">
                <p className="text-center text-gray-600 mb-6">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    Create account
                  </Link>
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        placeholder="Enter your password"
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

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Remember me
                      </label>
                    </div>

                    <Link
                      href="/forgot-password"
                      className="text-sm font-semibold text-rose-600 hover:text-rose-700"
                    >
                      Forgot password?
                    </Link>
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
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default Login;
