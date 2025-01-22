import { siteConfig } from "@/config/siteConfig";

export default function Head() {
  return (
    <>
      <title> {siteConfig.siteName} </title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content="Built with Next.js and TypeScript" />
    </>
  );
}
