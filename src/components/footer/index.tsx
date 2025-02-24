"use client";
import { motion } from "framer-motion";
import { FaDiscord, FaFacebook , FaLinkedin, FaTelegram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-stroke bg-white dark:border-strokedark dark:bg-background py-4">
      <div className="px-4 lg:px-12 2xl:px-48">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Request Link - Left Side on Desktop */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex justify-center md:justify-start mb-3 md:mb-0 md:w-[15%]"
          >
            <a  className="hover:text-primary text-sm">
              Request
            </a>
          </motion.div>
          
          {/* Info Text - Always Centered with 70% Width on Desktop */}
          <div className="text-sm text-gray-600 dark:text-gray-300 text-center mb-3 md:mb-0 md:w-[70%]">
            This site does not host any files on our server; we only provide links to media hosted on third-party services.
          </div>
          
          {/* Social Icons - Right Side on Desktop */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: { opacity: 1, y: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="flex justify-center md:justify-end md:w-[15%]"
          >
            <ul className="flex items-center gap-4 ">
              {/* Facebook */}
             
              {/* Twitter */}
              <li>
  <a
    href="https://discord.gg/pUUYuvpw"
    aria-label="Discord"
    className="flex items-center  text-[#D1D8E0] hover:text-primary transition-colors duration-300"
  >
    <FaDiscord size={22} />
    <span className="ml-2 text-md">Discord</span>
  </a>
</li>
              {/* LinkedIn */}
              <li>
                {/* <a  aria-label="LinkedIn" className="text-[#D1D8E0] hover:text-primary transition-colors duration-300">
                  <FaTelegram size={20} />
                </a> */}
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;