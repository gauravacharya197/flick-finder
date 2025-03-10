import Signup from "@/components/auth/Signup";
import Container from "@/components/common/Container";
import { siteConfig } from "@/config/siteConfig";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: siteConfig.siteName +" - "+ "Signup ",
  description: "",
  // other metadata
};

export default function Register() {
  return (
    <Container >
      <Signup />
    </Container>
  );
}
