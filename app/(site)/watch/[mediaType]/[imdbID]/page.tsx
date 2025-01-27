import Watch from "@/components/Watch";
import { siteConfig } from "@/config/siteConfig";
import { Metadata } from "next";
// export const metadata: Metadata = {
//   title: siteConfig.title,
//   description: siteConfig.description,
//   // other metadata
// };
const WatchPage = () => {
  return (
    <section className="pb-10 dark:bg-gray-900 dark:text-white pt-5 md:pt-5 xl:pt-11">
    <div className="mx-auto  px-4 md:px-8 2xl:px-0">
      <div className="flex flex-col lg:items-start lg:gap-3 xl:gap-4 container mx-auto">
          <Watch/>
        </div>
      </div>
    </section>
  );
};
export default WatchPage;
