import Login from "@/components/Auth/Login";
import { siteConfig } from "@/config/siteConfig";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: siteConfig.siteName +" - "+ "Login Page",
  description: "",
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
