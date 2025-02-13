import Login from "@/components/auth/Login";
import { siteConfig } from "@/config/siteConfig";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: siteConfig.siteName +" - "+ "Login Page",
  description: "",
  // other metadata
};

const LoginPage = async ({ searchParams }: { searchParams: Promise<{ code: string }> })=> {
  const { code } = await searchParams;  return (
    <>
      <Login code={code} />
    </>
  );
};

export default LoginPage;
