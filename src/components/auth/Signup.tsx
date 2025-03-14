"use client";
import { useAuth } from "@/app/context/AuthContext";
import { Register } from "@/services/AccountService";
import { googleHandler } from "@/utils/authUtils";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { FaGoogle, FaArrowRight, FaCheck } from "react-icons/fa";
import Spin from "../common/Spin";

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;
  const { login } = useAuth();

  const registerMutation = useMutation({
    mutationFn: (data) => Register(data),
    onSuccess: (res) => {
      login(res.data);
      router.push("/");
      toast.success("Registration successful", { position: "bottom-center" });
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message || "An error occurred. Please try again.",
        { position: "bottom-center" }
      );
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    registerMutation.mutate(data);
  };

  return (
    <>
      {/* <!-- ===== SignUp Form Start ===== --> */}
      <section className="py-8">
        <div className="mx-auto max-w-2xl px-4">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-lg bg-white p-6 shadow-md dark:border dark:border-strokedark dark:bg-gray-900"
          >
            <h2 className="mb-6 text-center text-2xl font-semibold text-black dark:text-white">
              Create an Account
            </h2>

            <button
              onClick={() => googleHandler(`${baseUrl}auth/login`)}
              aria-label="sign with google"
              className="mb-4 flex w-full items-center justify-center rounded border border-stroke bg-[#f8f8f8] py-3 text-base transition-all hover:border-primary hover:bg-primary/5 hover:text-primary dark:border-transparent dark:bg-[#2C303B] dark:hover:border-primary dark:hover:bg-primary/5"
            >
              <FaGoogle className="mr-3 text-primary" size={18} />
              Continue with Google
            </button>

            <div className="mb-6 flex items-center justify-center">
              <p className="px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Or, register with your email
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-5 space-y-4">
                <div>
                  <input
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    type="text"
                    placeholder="First name"
                    className="w-full rounded border-b border-stroke bg-transparent p-3 focus:border-primary focus-visible:outline-none dark:border-strokedark"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors?.firstName?.message?.toString()}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    type="text"
                    placeholder="Last name"
                    className="w-full rounded border-b border-stroke bg-transparent p-3 focus:border-primary focus-visible:outline-none dark:border-strokedark"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName?.message?.toString()}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...register("email", { required: "Email is required" })}
                    type="email"
                    placeholder="Email address"
                    className="w-full rounded border-b border-stroke bg-transparent p-3 focus:border-primary focus-visible:outline-none dark:border-strokedark"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message?.toString()}
                    </p>
                  )}
                </div>

                <div>
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
                    className="w-full rounded border-b border-stroke bg-transparent p-3 focus:border-primary focus-visible:outline-none dark:border-strokedark"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message?.toString()}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full rounded border-b border-stroke bg-transparent p-3 focus:border-primary focus-visible:outline-none dark:border-strokedark"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword.message?.toString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6 flex items-center">
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

              <button
          disabled={registerMutation.isPending}
          aria-label="signup with email and password"
          className="flex w-full items-center justify-center rounded-full  bg-black px-6 py-3 font-medium text-white transition-all hover:bg-blackho dark:bg-btndark dark:hover:bg-blackho disabled:cursor-not-allowed disabled:opacity-70"
        >
          {registerMutation.isPending ? (
            <Spin color="text-white"/>
          ) : (
            <>
              Create Account
              <FaArrowRight className="ml-2" size={14} />
            </>
          )}
        </button>

              <div className="mt-6 border-t border-stroke pt-4 text-center dark:border-strokedark">
                <p className="text-sm">
                  Already have an account?{" "}
                  <Link
                    className="text-primary hover:underline"
                    href="/auth/login"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
      {/* <!-- ===== SignUp Form End ===== --> */}
    </>
  );
};

export default Signup;
