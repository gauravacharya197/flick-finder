import Login from "@/components/auth/Login";
import Container from "@/components/common/Container";
import { siteConfig } from "@/config/siteConfig";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: siteConfig.siteName +" - "+ "Login",
  description: "",
  // other metadata
};

const LoginPage = async ({ searchParams }: { searchParams: Promise<{ code: string }> })=> {
  const { code } = await searchParams;  return (
    <Container >
      <Login code={code} />
    </Container>
  );
};

export default LoginPage;
