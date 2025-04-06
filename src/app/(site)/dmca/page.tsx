import { DMCAContent } from "@/components/about/DMCA";
import Container from "@/components/common/Container";
import { siteConfig } from "@/config/siteConfig";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: `DMCA Notice | ${siteConfig.siteName}`,
  description: `DMCA Notice for ${siteConfig.siteName}`,
  
};
const DMCAPage = () => {
  return (
    <Container className="pt-2 md:px-32">
      <DMCAContent/>
    </Container>
  );
};

export default DMCAPage;