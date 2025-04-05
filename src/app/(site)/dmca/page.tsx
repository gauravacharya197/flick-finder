import Container from "@/components/common/Container";
import { siteConfig } from "@/config/siteConfig";
import { motion } from "framer-motion";
import { Metadata } from "next";
import { FaBalanceScale, FaEnvelope, FaFileContract } from "react-icons/fa";
export const metadata: Metadata = {
  title: `DMCA Notice | ${siteConfig.siteName}`,
  description: `DMCA Notice for ${siteConfig.siteName}`,
  
};
const DMCAPage = () => {
  return (
    <Container className="pt-2 md:px-32">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6"
      >
        <div className="flex items-center mb-6">
          <FaBalanceScale className="text-primary mr-4" size={40} />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            DMCA Takedown Notice
          </h1>
        </div>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
            <FaFileContract className="mr-2 text-primary" /> 
            Digital Millennium Copyright Act (DMCA) Policy
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Flickday respects the intellectual property rights of others and expects its users to do the same. In connection with our service, we have adopted and implemented a policy respecting copyright law that provides for the removal of any content that violates these rights.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3">
            Procedure for Reporting Copyright Infringement
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            If you believe that a link on our platform infringes your copyright, you may send a written communication with the following information:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf</li>
            <li>Identification of the copyrighted work claimed to have been infringed</li>
            <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity</li>
            <li>Contact information of the notifying party (email, address, phone number)</li>
            <li>A statement that the notifying party has a good faith belief that the use of the material is not authorized by the copyright owner</li>
            <li>A statement that the information in the notification is accurate, and under penalty of perjury, that the notifying party is authorized to act on behalf of the copyright owner</li>
          </ul>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
            <FaEnvelope className="mr-2 text-primary" /> 
            Contact Information
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Please send all DMCA takedown notices to:
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mt-3">
           
           
            <a href="mailto:feedback@flickday.to" className="text-gray-600 dark:text-gray-300">
              Email: feedback@flickday.to
            </a>
          </div>
        </section>
      </motion.div>
    </Container>
  );
};

export default DMCAPage;