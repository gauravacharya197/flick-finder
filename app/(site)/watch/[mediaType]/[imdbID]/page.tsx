import Watch from "@/components/Watch";
import { siteConfig } from "@/config/siteConfig";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  // other metadata
};
const WatchPage = () => {
  return (
    <section className=" overflow-hidden pb-5  dark:bg-gray-900 dark:text-white md:pt-5 xl:pb-5 xl:pt-15">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div className="mt-8 flex flex-col gap-3.5 lg:flex-row xl:gap-4.5">
          {/* VidSrc embed iframe */}
          <Watch/>
        </div>
      </div>
    </section>
  );
};
export default WatchPage;
