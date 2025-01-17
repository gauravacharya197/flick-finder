import Login from "@/components/Auth/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login Page",
  description: "This is Login",
  // other metadata
};

const LoginPage = ({ searchParams }: { searchParams: { code?: string } }) => {
  return (
    <>
      <Login code={searchParams.code} />
    </>
  );
};

export default LoginPage;
