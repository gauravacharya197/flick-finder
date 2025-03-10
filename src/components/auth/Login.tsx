"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { googleHandler } from "@/utils/authUtils";
import { useForm } from "react-hook-form";
import { GetUser, UserLogin } from "@/services/AccountService";
import { useAuth } from "@/app/context/AuthContext";
import Spin from "../common/Spin";
import { useMutation, useQuery } from "@tanstack/react-query";
import { FaGoogle, FaArrowRight, FaCheck } from "react-icons/fa";

const Login = ({ code }: { code?: string }) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
  const { login } = useAuth();
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  // Login mutation using React Query
  const loginMutation = useMutation({
    mutationFn: (data) => UserLogin(data),
    onSuccess: (res) => {
      login(res.data);
      router.push("/");
      toast.success("Login successful", {
        position: "bottom-center"
      });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "An error occurred. Please try again.",
        { position: "bottom-center" }
      );
    }
  });
  
  // Google Auth mutation using React Query
  const googleAuthMutation = useMutation({
    mutationFn: (authCode: string) => GetUser(authCode),
    onSuccess: (res: any) => {
      if (res) {
        login(res.data);
        router.push("/");
        toast.success("Login successful", {
          position: "bottom-center"
        });
      }
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ||
          "An error occurred. Please try again.",
        { position: "bottom-center" }
      );
    }
  });

  useEffect(() => {
    if (code) {
      console.log("Sending request with code:", code);
      googleAuthMutation.mutate(code);
    }
  }, [code]);

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <>
      {/* <!-- ===== Login Form Start ===== --> */}
      <section className="pb-10 md:pt-2 xl:pt-1">
        <div className="relative z-1 mx-auto max-w-c-1016 px-4 pb-7.5 pt-10 sm:px-7.5 lg:px-15 lg:pt-15 xl:px-20 xl:pt-20">
          <div className="absolute left-0 top-0 -z-1 h-2/3 w-full rounded-lg"></div>

          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: -20,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 1, delay: 0.1 }}
            viewport={{ once: true }}
            className="animate_top rounded-lg bg-white px-4 pt-7.5 shadow-solid-8 dark:border dark:border-strokedark dark:bg-gray-900 sm:px-7.5 xl:px-15 xl:pt-15"
          >
            <h2 className="mb-15 text-center text-2xl font-semibold text-black dark:text-white sm:text-3xl xl:text-sectiontitle2">
              Login to Your Account
            </h2>
            <div className="flex flex-col">
              <div className="flex items-center gap-4 sm:gap-8">
                <button
                  onClick={() => googleHandler(`${baseUrl}auth/login`)}
                  aria-label="sign with google"
                  className="text-body-color dark:text-body-color-dark dark:shadow-two mb-6 flex w-full items-center justify-center rounded-sm border border-stroke bg-[#f8f8f8] px-4 py-3 text-base outline-none transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-[#2C303B] dark:hover:border-primary dark:hover:bg-primary/5 dark:hover:text-primary dark:hover:shadow-none sm:px-6"
                  disabled={googleAuthMutation.isPending}
                >
                  {googleAuthMutation.isPending ? (
                    <Spin />
                  ) : (
                    <>
                      <span className="mr-3">
                        <FaGoogle className="text-primary" size={20} />
                      </span>
                      Continue with Google
                    </>
                  )}
                </button>
              </div>
            </div>
            <br />
            <div className="mb-10 flex items-center justify-center">
              <span className="dark:bg-stroke-dark hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
              <p className="text-body-color dark:text-body-color-dark w-full px-5 text-center text-base">
                Or, login with your email
              </p>
              <span className="dark:bg-stroke-dark hidden h-[1px] w-full max-w-[200px] bg-stroke dark:bg-strokedark sm:block"></span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-7.5 flex flex-col gap-7.5 lg:mb-12.5 lg:flex-row lg:justify-between lg:gap-14">
                <div className="w-full">
                  <input
                    placeholder="Email"
                    {...register("email", { required: "Email is required" })}
                    type="email"
                    className="w-full border-b border-stroke bg-transparent pb-2.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                  />
                  {errors.email && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.email.message?.toString()}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long",
                      },
                    })}
                    type="password"
                    placeholder="Password"
                    className="w-full border-b border-stroke bg-transparent pb-2.5 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white"
                  />
                  {errors.password && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.password.message?.toString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-10 md:justify-between xl:gap-15">
                <div className="flex flex-wrap gap-4 md:gap-10">
                  <div className="mb-4 flex items-center">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      className="peer sr-only"
                    />
                    <span className="group mt-1 flex h-5 min-w-[20px] items-center justify-center rounded border-gray-300 bg-gray-100 text-blue-600 peer-checked:bg-primary dark:border-gray-600 dark:bg-gray-700">
                      <FaCheck
                        className="opacity-0 peer-checked:group-[]:opacity-100"
                        size={10}
                      />
                    </span>
                    <label
                      htmlFor="default-checkbox"
                      className="flex max-w-[425px] cursor-pointer select-none pl-3"
                    >
                      Keep me signed in
                    </label>
                  </div>

                  <a href="#" className="hover:text-primary">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  aria-label="login with email and password"
                  className="inline-flex items-center gap-2.5 rounded-full bg-black px-6 py-3 font-medium text-white duration-300 ease-in-out hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <Spin />
                  ) : (
                    <>
                      Log in
                      <FaArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-12.5 border-t border-stroke py-5 text-center dark:border-strokedark">
                <p>
                  Don't have an account?{" "}
                  <Link
                    className="text-black hover:text-primary dark:text-white hover:dark:text-primary"
                    href="/auth/signup"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
      {/* <!-- ===== Login Form End ===== --> */}
    </>
  );
};

export default Login;