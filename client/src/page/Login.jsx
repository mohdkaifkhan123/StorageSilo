import React, { useState } from "react";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";
import {DynamicToast} from "../components/toast";
const GoogleIcon = () => (
  <svg className="h-5 w-5 mr-3 text-gray-700" viewBox="0 0 24 24">
    <path
      fill="#EA4335"
      d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.11C18.281 1.055 15.477 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.854 11.57-11.79 0-.795-.085-1.4-.195-1.925H12.24z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg
    className="h-5 w-5 mr-3 text-black"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.73-1.2 1.87-1.05 2.98 1.12.09 2.27-.56 3-1.43z" />
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, isLoading,isAuthenticated, error, clearError } = useAuthStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      if(isAuthenticated)
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 flex h-full w-full bg-white font-sans antialiased selection:bg-black selection:text-white overflow-hidden">
      {/* Toast Notification Container placed at the top-right of the screen */}
      {error && (
        <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
          <DynamicToast title={"error"} message={error} onClose={clearError}/>
        </div>
      )}

      <div className="relative hidden h-full lg:w-[55%] bg-[#1E1915] lg:flex flex-col justify-between p-16 overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-screen bg-[radial-gradient(#F3F4F6_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="absolute -left-16 top-1/4 h-96 w-96 rounded-full bg-[#3D352E] blur-3xl opacity-60"></div>
        <div className="absolute right-10 bottom-10 h-72 w-72 rounded-3xl bg-[#2B2420] rotate-12 opacity-80 border border-[#443B35]"></div>

        <div className="relative flex flex-col h-full justify-between z-10">
          <div className="flex items-center space-x-3 text-white">
            <div className="grid grid-cols-2 gap-0.5 w-7 h-7">
              <div className="bg-white rounded-sm"></div>
              <div className="bg-indigo-400 rounded-sm"></div>
              <div className="bg-indigo-300 rounded-sm"></div>
              <div className="bg-white/40 rounded-sm"></div>
            </div>
            <span className="text-xl font-bold tracking-tight">
              StorageSilo
            </span>
          </div>

          <div className="max-w-xl space-y-4">
            <h1 className="text-4xl font-light leading-tight text-[#F7F5F3] sm:text-5xl">
              Keep your team's work{" "}
              <span className="font-semibold text-indigo-300">
                synchronized
              </span>{" "}
              in one clean interface.
            </h1>
            <p className="text-base text-gray-400 max-w-md">
              Securely store, collaborative-tag, and coordinate internal
              workflows without leaving your canvas pipeline.
            </p>
          </div>

          <div className="text-xs text-gray-500">
            &copy; 2026 StorageSilo Systems Inc. All rights reserved.
          </div>
        </div>
      </div>

      <div className="flex h-full w-full lg:w-[45%] flex-col justify-center px-8 sm:px-16 lg:px-20 bg-white overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center justify-between border-b border-gray-100 pb-5">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              Sign In
            </h2>
            <a
              href="/register"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors bg-indigo-50/50 px-3 py-1.5 rounded-lg"
            >
              Create an account
            </a>
          </div>

          <div className="mt-8 space-y-3">
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 active:scale-[0.99] transition-all duration-150"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 active:scale-[0.99] transition-all duration-150"
            >
              <AppleIcon />
              Continue with Apple
            </button>
          </div>

          <div className="relative my-8">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs font-medium uppercase tracking-wider">
              <span className="bg-white px-4 text-gray-400">
                or use credentials
              </span>
            </div>
          </div>

          <form action="#" method="POST" className="space-y-4">
            <div className="relative group">
              <input
                id="email"
                name="email"
                type="email"
                placeholder=" "
                required
                className="peer block w-full rounded-xl border border-gray-200 px-4 pt-5 pb-2 text-gray-950 bg-white placeholder-transparent focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-xs text-gray-400 duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-black pointer-events-none"
              >
                Email Address
              </label>
            </div>

            <div className="relative group">
              <input
                id="password"
                name="password"
                type="password"
                placeholder=" "
                required
                className="peer block w-full rounded-xl border border-gray-200 px-4 pt-5 pb-2 text-gray-950 bg-white placeholder-transparent focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
              <label
                htmlFor="password"
                className="absolute left-4 top-3.5 origin-[0] -translate-y-2.5 scale-75 transform text-xs text-gray-400 duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-black pointer-events-none"
              >
                Password
              </label>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-xs text-gray-500 select-none"
                >
                  Remember me
                </label>
              </div>
              <div className="text-xs">
                <a
                  href="#"
                  className="font-medium text-gray-500 hover:text-black transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSubmit}
                type="submit"
                className="flex w-full justify-center rounded-xl bg-black px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-150"
              >
                Sign In to StorageSilo
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs leading-relaxed text-gray-400">
            By accessing this workspace portal, you establish compliance with
            our{" "}
            <a
              href="#"
              className="font-medium text-gray-600 hover:text-black underline underline-offset-2 transition-colors"
            >
              Terms of Operations
            </a>{" "}
            &amp;{" "}
            <a
              href="#"
              className="font-medium text-gray-600 hover:text-black underline underline-offset-2 transition-colors"
            >
              Privacy Framework
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}