import Watch from "@/components/Watch";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "FlickFinder - Pick movie of based on your emotion",
  description: "Home of your favorite Movies",
  // other metadata
};
const WatchPage = () => {
  return (
    <section className="pb-20 pt-15 dark:bg-gray-900 dark:text-white lg:pb-25 lg:pt-40 xl:pb-30 xl:pt-25">
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
