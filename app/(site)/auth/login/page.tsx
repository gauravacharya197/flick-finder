import Signin from "@/components/Auth/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Page",
  description: "This is Login",
  // other metadata
};

const LoginPage = () => {
  return (
    <>
      <Signin />
    </>
  );
};

export default LoginPage;
